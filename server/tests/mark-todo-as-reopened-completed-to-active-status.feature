Feature: Todo Management

  Scenario: Given a completed todo, When the user marks it as reopened, Then the todo's status is changed back to active.
    Given a completed todo
    When the user marks it as reopened
    Then the todo's status is changed back to active.