describe('Blog app', function () {
   beforeEach(function () {
      cy.request('POST', 'http://localhost:3001/api/testing/resetDb');
      const user = {
         name: 'Abdel-Rahman MH',
         username: 'abdo',
         password: 'test',
      };
      cy.request('POST', 'http://localhost:3001/api/users', user).should('be.ok');
      cy.visit('');
   });

   it('Login form is shown', function () {
      cy.contains('Log in to application');
      cy.contains('Login');
      cy.get('#username').should('be.visible');
      cy.get('#password').should('be.visible');
   });

   describe('Login', function () {
      it('succeeds with correct credentials', function () {
         cy.get('#username').type('abdo');
         cy.get('#password').type('test');
         cy.contains('Login').click();
         cy.contains('Abdel-Rahman MH signed in successfully!').should('have.css', 'borderRadius', '4px').and('have.css', 'backgroundColor', 'rgb(76, 175, 80)').and('have.css', 'color', 'rgb(255, 255, 255)');

         cy.contains('Abdel-Rahman MH logged in').should('exist');
         cy.contains('logout').should('be.visible');
         cy.contains('new blog').should('be.visible');

         cy.get('#username').should('not.exist');
         cy.get('#password').should('not.exist');
      });

      it('fails with wrong credentials', function () {
         cy.get('#username').type('abdo');
         cy.get('#password').type('worngPass');
         cy.contains('Login').click();
         cy.contains('Invalid username or password').should('have.css', 'borderRadius', '4px').and('have.css', 'backgroundColor', 'rgb(255, 82, 82)').and('have.css', 'color', 'rgb(255, 255, 255)');

         cy.contains('Log in to application');
         cy.contains('Login');
         cy.contains('logout').should('not.exist');
         cy.contains('new blog').should('not.exist');

         cy.get('#username').should('be.visible');
         cy.get('#password').should('be.visible');
      });
   });
   describe('When logged in', function () {
      beforeEach(function () {
         cy.login({ username: 'abdo', password: 'test' });
      });

      it('should start with empty form fields', function () {
         cy.get('#title').should('not.be.visible');
         cy.get('#url').should('not.be.visible');
      });

      it('should create a new blog', function () {
         cy.contains('new blog').click();
         cy.get('#title').should('exist').type('test blog added');
         cy.get('#url').should('exist').type('http://example.com/cypress');

         cy.get('button[type=submit]').contains('Create').click();

         cy.get('.blogs-cont').children().should('have.length', 1);
         cy.contains('A new blog "test blog added" added').should('have.css', 'backgroundColor', 'rgb(76, 175, 80)');
         cy.get('.blogs-cont').contains('test blog added Abdel-Rahman MH');
         cy.get('button').contains('new blog');

         cy.get('#title').should('not.be.visible');
         cy.get('#url').should('not.be.visible');

         // check view button
         cy.get('.blogs-cont > div:first-child > p > button').contains('view').click();
         cy.get('.blogs-cont > div:first-child > p > button').contains('hide');
         cy.contains('http://example.com/cypress');
         cy.contains('likes 0');
         cy.get('button').contains('like');
      });
      it('fails with wrong credentials', function () {
         cy.intercept('POST', '/api/blogs', {
            statusCode: 400,
            body: { error: 'Invalid blog data' },
         }).as('createBlog');

         cy.contains('new blog').click();
         cy.get('#title').should('exist').type('test blog added');
         cy.get('#url').should('exist').type('not valid url');

         cy.get('button[type=submit]').contains('Create').click();

         cy.wait('@createBlog');

         cy.contains('Error creating blog').should('have.css', 'backgroundColor', 'rgb(255, 82, 82)');

         cy.get('.blogs-cont').contains('test blog added').should('not.exist');

         cy.get('button').contains('new blog');
         cy.get('#title').should('exist');
         cy.get('#url').should('exist');
      });
      describe('when blog added', function () {
         beforeEach(() => {
            cy.createBlog({ title: 'blog added for cypress', url: 'http://example.com/cypress' });
         });
         it('user can like to blog', function () {
            cy.get('.blogs-cont > .blog:first-child').contains('view').click();
            cy.get('.blogs-cont > .blog:first-child').contains('likes 0');
            cy.get('.blogs-cont > .blog:first-child button').contains('like').click();
            cy.get('.blogs-cont > .blog:first-child').contains('likes 1');

            cy.visit('/');
            cy.get('.blogs-cont > .blog:first-child').contains('view').click();
            cy.get('.blogs-cont > .blog:first-child').contains('likes 1');
         });
         it('user can delete her crated blog', function () {
            Cypress.on('window:confirm', (message) => {
               expect(message).to.equal('Remove blog "blog added for cypress"');
               return true;
            });
            cy.get('.blogs-cont > .blog:first-child').contains('view').click();
            cy.get('.blogs-cont > .blog:first-child button').contains('delete').click();
            cy.contains('blog added for cypress').should('not.exist');
            cy.get('.blogs-cont').children().should('have.length', 0);
         });
         it('delete button only showing on user that crate this blog', function () {
            const user = {
               name: 'Ahmed',
               username: 'ahmed',
               password: 'test',
            };
            const blogPayload = {
               title: 'title with different user',
               url: 'http://example.com/test',
            };

            cy.createUserAndAddBlog(user, blogPayload);
            cy.get('.blogs-cont')
               .find('div')
               .each(($element) => {
                  cy.wrap($element).get('button').contains('view').click();
               });
            cy.get('.blog').contains('blog added for cypress').parent().get('button').contains('delete');
            cy.get('.blog').contains('title with different user').parent().contains('delete').should('not.exist');
         });
         it('blogs ordered by likes', function () {
            const numberOfBlogs = 20;
            const userCredentials = { username: 'abdo', password: 'test' };

            cy.createRandBlogs(numberOfBlogs, userCredentials);

            cy.get('.blogs-cont')
               .find('.blog')
               .each(($blogPost) => {
                  cy.wrap($blogPost).contains('view').click();
               });

            cy.get('.blog').then((blogPosts) => {
               if (blogPosts.length >= 2) {
                  for (let i = 0; i < blogPosts.length - 1; i++) {
                     const currentLikes = getLikes(blogPosts.eq(i));
                     const nextLikes = getLikes(blogPosts.eq(i + 1));

                     expect(currentLikes).to.be.gte(nextLikes);
                  }
               }
            });

            function getLikes(blogPost) {
               return +blogPost.find('.likes-count').text();
            }
         });
      });
   });
});
