Feature: Mark Todo as Completed

  Scenario: Given an active todo, When the user marks it as complete, Then the todo's status is changed to completed.
    Given an active todo
    When the user marks it as complete
    Then the todo's status is changed to completed.