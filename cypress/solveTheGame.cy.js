describe('Memory Game Solver', () => {
  it('automatically solves the memory game and checks for the success modal', () => {
    cy.viewport(2000, 1300);
    cy.visit('https://notoolsnocraft.github.io/zapamtilica.github.io/');

    // This object stores the index of the first seen card for each image source.
    let memory = {};

    // Recursive function to keep trying until the modal appears.
    function solveGame() {
      cy.get('body').then($body => {
        // If the modal is visible, the game is solved.
        if ($body.find('.modal:visible').length > 0) {
          // Assert that the modal contains the expected success text.
          cy.get('.modal').should('contain', 'Fenomenalno odrađeno!');
        } else {
          // Otherwise, iterate over all cards.
          cy.get('.card-container').each(($card, index) => {
            // Only process cards that are not yet matched.
            if (!$card.find('.card').first().hasClass('front-correct')) {
              cy.wrap($card).click();
              cy.wait(300); // Wait for the card flip animation

              // Get the image source from the flipped card.
              cy.wrap($card)
                .find('.back img')
                .invoke('attr', 'src')
                .then(src => {
                  // If we've seen this image (and it's a different card), click its partner.
                  if (memory[src] !== undefined && memory[src] !== index) {
                    cy.get('.card-container').eq(memory[src]).click();
                    cy.wait(500); // Wait for the matching animation to complete
                  } else {
                    // Otherwise, record this card's index for future matching.
                    memory[src] = index;
                  }
                });
            }
          })
          .then(() => {
            // After processing all cards, wait a bit and then try again.
            cy.wait(1000);
            solveGame();
          });
        }
      });
    }

    // Start the recursive matching process.
    solveGame();
  });
});
