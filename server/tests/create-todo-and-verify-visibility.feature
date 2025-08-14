Feature: Todo Creation

  Scenario: Given the user is on the todo creation page, When the user enters a title and clicks 'Add', Then a new todo is created and visible in the list.
    Given the user is on the todo creation page
    When the user enters a title and clicks 'Add'
    Then a new todo is created and visible in the list.