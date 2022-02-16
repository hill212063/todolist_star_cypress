describe("Add todo and edit favorite and unfavorite in edit page",() => {

    it("Adding todo and check todo", () => {
        cy.visit("http://localhost:3000/")
        Cypress.config("baseUrl", 'http://localhost:8080')
        cy.request('DELETE', 'api/todo')
        const items =[
            { title:'Buy milk',description:'buy milk no.1',finished:false,favor:false},
            { title:'Buy milk',description:'buy milk no.2',finished:false,favor:false},
            { title:'Buy eggs',description:'buy eggs no.1',finished:false,favor:false},
            { title:'Buy eggs',description:'buy eggs no.2',finished:false,favor:false},
            { title:'Buy eggs',description:'buy eggs no.3',finished:false,favor:false},
            { title:'Buy padthai',description:'buy padthai no.1',finished:false,favor:false}]

        cy.visit('http://localhost:3000/add')
        cy.server()
        cy.route('POST', '/api/todo').as('create')
        cy.wrap(items)
        .each(todo => {
            cy.get('#title')
            .type(todo.title)
            .should('have.value',todo.title)
            cy.get('#description')
            .type(todo.description)
            .should('have.value',todo.description)
            cy.get('.btn').click()
            cy.wait('@create')
            cy.visit('http://localhost:3000/add')
        })

        cy.visit('http://localhost:3000')
        
        cy.get('.list-group-item ').as('datalist')
        
        cy.get('@datalist')
        .should('have.length', 6)
        
        cy.get('@datalist')
        .filter(':contains("Buy milk")')
        .should('have.length', 2)
        
        cy.get('@datalist')
        .filter(':contains("Buy eggs")')
        .and('have.length', 3)
        
        cy.get('@datalist')
        .filter(':contains("Buy padthai")')
        .and('have.length', 1)
    })

    it('Check before favorite todo in edit page', ()=>{
        cy.visit('http://localhost:3000/')
        
        cy.get('.list-group-item').eq(2)
        .should('contain',"Buy eggs")
        .click()

        cy.get('[src="/static/media/none-shining-star.9208aab9c45e8295da92.png"]').eq(2)
        .should('be.visible')
        cy.get('.badge-warning')
        .should('have.text','favorite')

        cy.get('.mr-2').click()
        cy.get('#title')
        .should('have.value','Buy eggs')
        cy.get('#description')
        .should('have.value','buy eggs no.1')
        
        cy.get('[src="/static/media/none-shining-star.9208aab9c45e8295da92.png"]')
        .should('be.visible')
        cy.get('.badge-warning')
        .should('have.text', 'Favorite')
    })

    it("Check after favorite todo in edit page",() => {
        cy.visit('http://localhost:3000/')
        
        cy.get('.list-group-item').contains("Buy eggs")
        .click()
        cy.get('.mr-2').click()
        cy.get('#title')
        .should('have.value','Buy eggs')
        cy.get('#description')
        .should('have.value','buy eggs no.1')

        cy.get('.badge-warning')
        .click()

        cy.get('[src="/static/media/shining-star.f7dc65993284130f5c10.png"]')
        .should('be.visible')
        cy.get('.badge-outline-warning')
        .should('have.text','Unfavorite')

        cy.get('.nav-item').eq(0).click()

        cy.get('.list-group-item ').eq(0)
        .should('contain','Buy eggs')
        .click()

        cy.get('[src="/static/media/shining-star.f7dc65993284130f5c10.png"]').eq(0)
        .should('be.visible')
        cy.get('.badge-outline-warning')
        .should('have.text','unfavorite')
    })

    it("Check after Unfavorite todo in edit page", () => {

        cy.visit('http://localhost:3000/')
        
        cy.get('.list-group-item').eq(0)
        .should('contain',"Buy eggs")
        .click()
        
        cy.get('.mr-2').click()
        cy.get('#title')
        .should('have.value','Buy eggs')
        cy.get('#description')
        .should('have.value','buy eggs no.1')
        
        cy.get('[src="/static/media/shining-star.f7dc65993284130f5c10.png"]')
        .should('be.visible')
        cy.get('.badge-outline-warning')
        .should('have.text','Unfavorite')
        .click()

        cy.get('[src="/static/media/none-shining-star.9208aab9c45e8295da92.png"]')
        .should('be.visible')
        cy.get('.badge-warning')
        .should('have.text', 'Favorite')

        cy.get('.nav-item').eq(0).click()

        cy.get('.list-group-item ').eq(5)
        .should('contain','Buy eggs')
        .click()

        cy.get('[src="/static/media/none-shining-star.9208aab9c45e8295da92.png"]').eq(5)
        .should('be.visible')
        cy.get('.badge-warning')
        .should('have.text','favorite')
    })
})