describe ('Search in index page', ()=> {

    it("Visiting", () =>{ // http://localhost:3000/
        cy.visit('http://localhost:3000/');
    })
    it("Click favorite", () => {
        Cypress.config('baseUrl','http://localhost:8080'); // clear data in DB
        cy.request('DELETE','/api/todo');
        const items = [
            { title:'Buy milk',description:'buy milk no.1',finished:false},
            { title:'Buy milk',description:'buy milk no.2',finished:false},
            { title:'Buy eggs',description:'buy eggs no.1',finished:false},
            { title:'Buy eggs',description:'buy eggs no.2',finished:false},
            { title:'Buy eggs',description:'buy eggs no.3',finished:false},
            { title:'Buy padthai',description:'buy padthai no.1',finished:false}]; // create items

        cy.visit('http://localhost:3000/add');
        cy.server();
        cy.route('POST','/api/todo').as('create');
        cy.wrap(items)
            .each(todo => {
                cy.get('#title') // get id of input title
                .type(todo.title)
                .should('have.value',todo.title) // data should have value and data should be items.title

                cy.get('#description') // get id of input description
                .type(todo.description)
                .should('have.value',todo.description) // data should have value and data should be items.description

                cy.get('.btn').click(); // click submit todo-list

                cy.wait("@create")

                cy.visit('http://localhost:3000/add'); //recreate
            })
        cy.visit('http://localhost:3000/');

        // check datalist following my items
        cy.get(".list-group-item")
            .should("have.length",6) // following items length equals 6
        cy.get(".list-group-item")
            .filter(":contains('Buy milk')").should("have.length",2) // following items that name "Buy milk" length equals 2
        cy.get(".list-group-item")
            .filter(":contains('Buy eggs')").should("have.length",3) // following items that name "Buy eggs" length equals 3
        cy.get(".list-group-item")
            .filter(":contains('Buy padthai')").should("have.length",1) // following items that name "Buy padthai" length equals 1

        cy.get(".list-group-item").eq(2)
            .click()
        cy.get("#favoritebutton").click()

        // check position of favorite list item
        cy.get(".list-group-item").eq(0).should("have.text","Buy eggs") // eq(0) according to first fav.

        // check favorite to unfavorite
        cy.get(".list-group-item").eq(0)
            .click()
        cy.get("#favoritebutton").should("have.text","unfavorite")

        // check img star shining
        cy.get(".list-group-item").eq(0).find('img').should('have.attr', 'src', '/static/media/shining-star.f7dc65993284130f5c10.png')


        cy.get(".list-group-item").eq(5)
            .click()
        cy.get("#favoritebutton").click()

        cy.get(".list-group-item").eq(0).should("have.text","Buy eggs")
        cy.get(".list-group-item").eq(1).should("have.text","Buy padthai")

        // check favorite to unfavorite
        cy.get(".list-group-item").eq(0)
            .click()
        cy.get("#favoritebutton").should("have.text","unfavorite")
        cy.get(".list-group-item").eq(1)
        .click()
        cy.get("#favoritebutton").should("have.text","unfavorite")

        // check img star shining
        cy.get(".list-group-item").eq(1).find('img').should('have.attr', 'src', '/static/media/shining-star.f7dc65993284130f5c10.png')

        cy.get(".list-group-item").eq(5)
            .click()
        cy.get("#favoritebutton").click()

        cy.get(".list-group-item").eq(0).should("have.text","Buy eggs")
        cy.get(".list-group-item").eq(1).should("have.text","Buy eggs")
        cy.get(".list-group-item").eq(2).should("have.text","Buy padthai")

        // check favorite to unfavorite
        cy.get(".list-group-item").eq(0)
            .click()
        cy.get("#favoritebutton").should("have.text","unfavorite")
        cy.get(".list-group-item").eq(1)
            .click()
        cy.get("#favoritebutton").should("have.text","unfavorite")
        cy.get(".list-group-item").eq(2)
            .click()
        cy.get("#favoritebutton").should("have.text","unfavorite")

        // check img star shining
        cy.get(".list-group-item").eq(2).find('img').should('have.attr', 'src', '/static/media/shining-star.f7dc65993284130f5c10.png')

        // unfavorite
        cy.get(".list-group-item").eq(0)
            .click()
        cy.get("#favoritebutton").click()

        // check position of favorite list item
        cy.get(".list-group-item").eq(0).should("have.text","Buy eggs")
        cy.get(".list-group-item").eq(1).should("have.text","Buy padthai")

        // add fav again
        cy.get(".list-group-item").eq(3)
            .click()
        cy.get("#favoritebutton").click()

        cy.get(".list-group-item").eq(0).should("have.text","Buy eggs")
        cy.get(".list-group-item").eq(1).should("have.text","Buy padthai")
        cy.get(".list-group-item").eq(2).should("have.text","Buy milk")

        // check favorite to unfavorite
        cy.get(".list-group-item").eq(0)
            .click()
        cy.get("#favoritebutton").should("have.text","unfavorite")
        cy.get(".list-group-item").eq(1)
            .click()
        cy.get("#favoritebutton").should("have.text","unfavorite")
        cy.get(".list-group-item").eq(2)
            .click()
        cy.get("#favoritebutton").should("have.text","unfavorite")

        // check img star shining
        cy.get(".list-group-item").eq(2).find('img').should('have.attr', 'src', '/static/media/shining-star.f7dc65993284130f5c10.png')

        // unfav again
        cy.get(".list-group-item").eq(1)
        .click()
        cy.get("#favoritebutton").click()

        // check position of favorite list item
        cy.get(".list-group-item").eq(0).should("have.text","Buy eggs")
        cy.get(".list-group-item").eq(1).should("have.text","Buy milk")

    })
    
})