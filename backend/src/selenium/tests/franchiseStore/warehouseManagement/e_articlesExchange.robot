*** Settings ***
Library           SeleniumLibrary
Resource          ../resourceMainPage.robot
Resource          resourceWarehouseManagementPage.robot

*** Test Cases ***

Create And Confirm WT
    Login FranchiseStore
    Select MainPage Menu                                  Towary
    Select Warehouse Management From Header Menu
    Select Left Menu                                      Wymiana towarów
    Click Create Articles Exchange Document
    Document Should Open                                  WYMIANA TOWARÓW WT 
    Input Comments
    Select From List Menu                                 Dodaj nową pozycję
    Input Good Name In Article Line
    Select Article From Modal List                        2
    Select Article From Modal List                        1
    Document Should Open                                  WYMIANA TOWARÓW WT 
    Input Quantity In Article Line
    Select Tab Of Document
    Select From List Menu                                 Dodaj nową pozycję
    Input Good Name In Article Line                       Ziemniaki Luz
    Select Article From Modal List                        2
    Input Quantity In Article Line                        9
    Click Recalculate
    Confirm Document
    Document Should Be Confirmed
    [Teardown]    Close Browser