/// <reference types="Cypress" />

describe('Note app', function () {
   beforeEach(() => {
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
      const user = {
         name: 'Abdel-Rahman Mahmoud',
         username: 'abdo',
         password: 'test',
      };
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user);
      cy.visit('/');
   });
   it('login fails with wrong password', function () {
      cy.contains('login').click();
      cy.get('#username').type('abdo');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();

      cy.contains('Wrong credentials');
      cy.get('.error').should('contain', 'Wrong credentials').and('have.css', 'color', 'rgb(255, 0, 0)').and('have.css', 'border-style', 'solid');
      cy.get('html').should('not.contain', 'Abdel-Rahman Mahmoud logged in');
   });
   it('front page can be opened', function () {
      cy.contains('Notes');
      cy.contains('Note app, Department of Computer Science, University of Helsinki 2023');
   });
   it('user can log in', function () {
      cy.contains('login').click();
      cy.get('#username').type('abdo');
      cy.get('#password').type('test');
      cy.get('#login-button').click();

      cy.contains('Abdel-Rahman Mahmoud logged in');
   });
   describe('when logged in', function () {
      beforeEach(function () {
         cy.login({ username: 'abdo', password: 'test' });
      });

      it('a new note can be created', function () {
         cy.get('#new\\ note').click();
         cy.get('input').type('a note created by cypress');
         cy.contains('save').click();
         cy.contains('a note created by cypress');
      });

      describe('and a note exists', function () {
         beforeEach(function () {
            cy.createNote({
               content: 'another note cypress',
               important: true,
            });
         });

         it('it can be made not important', function () {
            cy.contains('another note cypress').contains('make not important').click();

            cy.contains('another note cypress').contains('make important');
         });
      });
      describe('and several notes exist', function () {
         beforeEach(function () {
            cy.login({ username: 'abdo', password: 'test' });
            cy.createNote({ content: 'first note', important: false });
            cy.createNote({ content: 'second note', important: false });
            cy.createNote({ content: 'third note', important: false });
         });

         it('one of those can be made important', function () {
            cy.contains('second note').contains('make important').click();

            cy.contains('second note').contains('make not important');
         });
      });
   });
});
