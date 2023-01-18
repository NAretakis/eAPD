/// <reference types="cypress" />

import ActivityPage from '../../page-objects/activity-page';

// Tests performing basic MMIS APD tasks

/* eslint-disable no-return-assign */
/* eslint-disable prefer-arrow-callback */

describe('MMIS Basics', { tags: ['@apd', '@default', '@mmis'] }, () => {
  let activityPage;
  let apdUrl;
  let apdId;
  const years = [];

  before(() => {
    activityPage = new ActivityPage();
    cy.useStateStaff();
    cy.updateFeatureFlags({ enableMmis: true, adminCheckFlag: true });
    cy.reload();

    // Create a new MMIS APD
    cy.findAllByText('Create new').click();

    cy.findByRole('radio', { name: /MMIS/i }).click();
    cy.findByLabelText('APD Name').clear().type('MMIS APD Name!').blur();
    cy.findByRole('radio', { name: /No, this is for a new project./i }).click();
    cy.findByRole('checkbox', {
      name: /1115 or Waiver Support Systems/i
    }).click();
    cy.get(`[data-cy='create_apd_btn']`).should('not.be.disabled').click();

    cy.findByRole(
      'heading',
      { name: /APD Overview/i },
      { timeout: 100000 }
    ).should('exist');

    cy.location('pathname').then(pathname => {
      apdUrl = pathname.replace('/apd-overview', '');
      apdId = apdUrl.split('/').pop();
    });

    cy.get('[type="checkbox"][checked]').each((_, index, list) =>
      years.push(list[index].value)
    );
  });

  beforeEach(() => {
    cy.updateFeatureFlags({ enableMmis: true, adminCheckFlag: true });
    cy.visit(apdUrl);
  });

  after(() => {
    cy.deleteAPD(apdId);
  });

  describe('Create MMIS APD', () => {
    it('tests Create New page', () => {
      cy.contains('AK APD Home').click();
      cy.findAllByText('Create new').click();

      cy.contains(
        'This selection cannot be changed after creating a new APD.'
      ).should('exist');

      cy.findByRole('radio', { name: /MMIS/i }).focus().blur();
      cy.contains('Select an APD Type').should('exist');

      cy.findByRole('radio', { name: /HITECH/i }).click();
      cy.findAllByText('Select an APD Type').should('not.exist');

      // Verify HITECH fields show
      cy.findAllByText('Update Type').should('exist');
      cy.findAllByText('Medicaid Business Areas').should('not.exist');

      cy.findByRole('radio', { name: /MMIS/i }).click();

      // Verify MMIS fields show
      cy.findAllByText('Is this an APD update?').should('exist');
      cy.findAllByText('Medicaid Business Areas').should('exist');

      cy.get(`[data-cy='create_apd_btn']`).should('be.disabled');

      cy.findByLabelText('APD Name').clear().type('MMIS APD Test').blur();

      // Year validation
      years.forEach(year => {
        cy.findByRole('checkbox', { name: year }).click();
      });
      cy.contains('Select at least one year.').should('exist');

      years.forEach(year => {
        cy.findByRole('checkbox', { name: year }).click();
      });
      cy.contains('Select at least one year.').should('not.exist');

      // Update section validation
      cy.findByRole('radio', { name: /No, this is for a new project./i })
        .focus()
        .blur();
      cy.contains('Indicate whether this APD is an update.').should('exist');

      cy.findByRole('radio', {
        name: /No, this is for a new project./i
      }).click();
      cy.contains('Indicate whether this APD is an update.').should(
        'not.exist'
      );
      cy.findAllByText('Update Type').should('not.exist');

      cy.findByRole('radio', { name: /Yes, it is an update./i }).click();
      cy.findAllByText('Update Type').should('exist');

      cy.findByRole('checkbox', { name: /Annual update/i })
        .focus()
        .blur();
      cy.contains('Select at least one type of update.').should('exist');

      cy.findByRole('checkbox', { name: /As-needed update/i }).click();
      cy.contains('Select at least one type of update.').should('not.exist');

      cy.get(`[data-cy='create_apd_btn']`).should('be.disabled');

      // Medicaid Business Area validation
      cy.findByRole('checkbox', {
        name: /1115 or Waiver Support Systems/i
      })
        .focus()
        .blur();
      cy.contains('Provide an other Medicaid Business Area(s)').should('exist');

      cy.findByRole('checkbox', {
        name: /Program Integrity/i
      }).click();
      cy.contains('Provide an other Medicaid Business Area(s)').should(
        'not.exist'
      );

      cy.get(`[data-cy='create_apd_btn']`).should('not.be.disabled');

      // Other MBA Validation
      cy.findByText('Other').click();

      cy.get(`[data-cy='create_apd_btn']`).should('be.disabled');

      cy.get(`[data-cy='other_details']`).focus().blur();
      cy.contains('Provide an other Medicaid Business Area(s)').should(
        'not.exist'
      );

      cy.get(`[data-cy='other_details']`).type('This is other stuff.').blur();

      cy.get(`[data-cy='create_apd_btn']`).should('not.be.disabled');
      cy.findByRole('button', { name: /Cancel/i }).click();

      cy.contains('MMIS APD Test').should('not.exist');
    });
  });
  describe('MMIS Pages', () => {
    it('tests Activity Overview page', () => {
      cy.goToActivityDashboard();

      // Create new Activity
      cy.contains('Add Activity').click();
      cy.contains('Activity 1').should('exist');

      // Check Activity Overview
      cy.goToActivityOverview(0);
      cy.url().should('contain', '/activity/0/overview');
      cy.findAllByRole('heading', { name: /Activity Overview/i }).should(
        'exist'
      );

      // Defaults to empty field values
      cy.contains('Activity name').should('exist');
      activityPage.checkTinyMCE('activity-name-field', '');
      cy.contains('Activity snapshot').should('exist');
      activityPage.checkTinyMCE('activity-snapshot-field', '');
      cy.contains('Problem statement').should('exist');
      activityPage.checkTinyMCE('activity-problem-statement-field', '');
      cy.contains('Proposed solution').should('exist');
      activityPage.checkTinyMCE('activity-proposed-solution-field', '');

      // Check validation errors
      cy.turnOnAdminCheck();

      // Validation errors within admin check list
      cy.get('[class="eapd-admin-check-list"]').within(list => {
        cy.get(list).contains('Activity 1 Activity Overview').should('exist');
        cy.get(list).contains('Provide an Activity name').should('exist');
        cy.get(list).contains('Provide an Activity snapshot').should('exist');
        cy.get(list).contains('Provide a Problem statement').should('exist');
        cy.get(list).contains('Provide a Proposed solution').should('exist');
      });

      // Verifies Activity Overview exists in the admin check list and navigates to that page
      cy.checkAdminCheckHyperlinks(
        'Activity 1 Activity Overview',
        'Activity Overview',
        3
      );

      // Validation errors on the Activity Overview page
      cy.contains('Provide an Activity name').should('exist');
      cy.get('[data-cy="validationError"]')
        .contains('Provide an Activity snapshot')
        .should('exist');
      cy.get('[data-cy="validationError"]')
        .contains('Provide a Problem statement')
        .should('exist');
      cy.get('[data-cy="validationError"]')
        .contains('Provide a Proposed solution')
        .should('exist');

      cy.collapseAdminCheck();

      // Fill out fields and check that each validation error is cleared
      cy.get(`[data-cy="activity-name"]`).click().type('The Coolest Activity');
      cy.waitForSave();
      cy.contains('Provide an Activity name').should('not.exist');

      cy.setTinyMceContent(
        'activity-snapshot-field',
        'This is an activity snapshot.'
      );
      cy.waitForSave();
      cy.contains('Provide an Activity snapshot').should('not.exist');

      cy.setTinyMceContent(
        'activity-problem-statement-field',
        'This is a problem statement.'
      );
      cy.waitForSave();
      cy.contains('Provide a Problem statement').should('not.exist');

      cy.setTinyMceContent(
        'activity-proposed-solution-field',
        'This is a proposed solution.'
      );
      cy.waitForSave();
      cy.contains('Provide a Proposed solution').should('not.exist');

      // Check validation errors are gone from admin check
      cy.expandAdminCheck();
      cy.get('[class="eapd-admin-check-list"]').within(list => {
        cy.get(list)
          .contains('Activity 1 Activity Overview')
          .should('not.exist');
      });
      cy.turnOffAdminCheck();

      // Verify that fields save
      // Navigates away from page and back to check persistence of entered data
      cy.goToApdOverview();
      cy.wait(2000);
      cy.goToActivityOverview(0);

      cy.contains('Activity name').should('exist');
      activityPage.checkTinyMCE('activity-name-field', 'The Coolest Activity');
      cy.contains('Activity snapshot').should('exist');
      activityPage.checkTinyMCE(
        'activity-snapshot-field',
        '<p>This is an activity snapshot.</p>'
      );
      cy.contains('Problem statement').should('exist');
      activityPage.checkTinyMCE(
        'activity-problem-statement-field',
        '<p>This is a problem statement.</p>'
      );
      cy.contains('Proposed solution').should('exist');
      activityPage.checkTinyMCE(
        'activity-proposed-solution-field',
        '<p>This is a proposed solution.</p>'
      );
    });

    it('tests the Security Planning page', () => {
      cy.turnOnAdminCheck();
      cy.checkAdminCheckHyperlinks('Security Planning', 'Security Planning', 2);

      cy.get('[class="eapd-admin-check-list"]').within(list => {
        cy.get(list).contains('Security Planning').should('exist');
      });

      cy.contains('Provide Security and Interface Plan').should('exist');
      cy.get('[id="security-interface-plan"]').should('have.value', '');

      cy.setTinyMceContent(
        'security-interface-plan',
        'This is the Security Interface plan'
      );
      cy.waitForSave();

      cy.contains('Provide Security and Interface Plan').should('not.exist');

      cy.contains('Provide Business Continuity and Disaster Recovery').should(
        'exist'
      );
      cy.get('[id="bc-dr-plan"]').should('have.value', '');

      cy.setTinyMceContent(
        'bc-dr-plan',
        'This is the Business Continuity and Disaster Recovery plan'
      );
      cy.waitForSave();

      cy.contains('Provide Business Continuity and Disaster Recovery').should(
        'not.exist'
      );

      // Verify fields save
      cy.goToApdOverview();
      cy.wait(2000);
      cy.goToSecurityPlanning();

      cy.get('[id="security-interface-plan"]').should(
        'have.value',
        '<p>This is the Security Interface plan</p>'
      );
      cy.get('[id="bc-dr-plan"]').should(
        'have.value',
        '<p>This is the Business Continuity and Disaster Recovery plan</p>'
      );

      cy.get('[class="eapd-admin-check-list"]').within(list => {
        cy.get(list).contains('Security Planning').should('not.exist');
      });

      // Verify validation disappears when Admin Check is off
      cy.setTinyMceContent('security-interface-plan', '');
      cy.contains('Provide Security and Interface Plan').should('exist');

      cy.setTinyMceContent('bc-dr-plan', '');
      cy.contains('Provide Business Continuity and Disaster Recovery').should(
        'exist'
      );

      cy.findByRole('button', { name: /Stop Administrative Check/i }).click({
        force: true
      });

      cy.contains('Provide Security and Interface Plan').should('not.exist');
      cy.contains('Provide Business Continuity and Disaster Recovery').should(
        'not.exist'
      );

      // Todo: TEST CONTINUE AND BACK BUTTONS, Assurances and Compliance page crashes though.
    });
  });
});