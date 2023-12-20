// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', ({ username, password }) => {
   cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
      username,
      password,
   }).then(({ body }) => {
      localStorage.setItem('user', JSON.stringify(body));
      cy.visit('/');
   });
});

Cypress.Commands.add('createBlog', ({ title, url }) => {
   cy.request({
      url: `${Cypress.env('BACKEND')}/blogs`,
      method: 'POST',
      body: { title, url },
      headers: {
         Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
      },
   }).then((res) => {
      const prevData = JSON.parse(localStorage.getItem('user'));
      prevData.userData.blogs.push(res._id);
      localStorage.setItem('user', JSON.stringify(prevData));
   });
   cy.visit('/');
});

Cypress.Commands.add('createUserAndAddBlog', (user, blog) => {
   cy.request('POST', `${Cypress.env('BACKEND')}/users`, user).should('be.ok');
   cy.request('POST', `${Cypress.env('BACKEND')}/login`, user)
      .then((res) => {
         cy.request({
            url: `${Cypress.env('BACKEND')}/blogs`,
            method: 'POST',
            body: blog,
            headers: {
               Authorization: `Bearer ${res.body.token}`,
            },
         }).should('be.ok');
      })
      .should('be.ok');
   cy.visit('');
});

Cypress.Commands.add('createRandBlogs', (count, user) => {
   cy.request('POST', `${Cypress.env('BACKEND')}/login`, user)
      .then((res) => {
         const token = res.body.token;
         for (let i = 0; i < count; i++) {
            cy.request({
               url: `${Cypress.env('BACKEND')}/blogs`,
               method: 'POST',
               body: { title: `blog title ${i}`, url: 'https://example.com/cypress', likes: Math.floor(Math.random() * 200) },
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }).should('be.ok');
         }
      })
      .should('be.ok');
   cy.visit('');
});
