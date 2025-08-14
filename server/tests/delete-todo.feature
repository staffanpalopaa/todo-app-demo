Feature: Todo Management

  Scenario: Given an existing todo, When the user clicks 'Delete', Then the todo is removed from the system.
    Given an existing todo
    When the user clicks 'Delete'
    Then the todo is removed from the system