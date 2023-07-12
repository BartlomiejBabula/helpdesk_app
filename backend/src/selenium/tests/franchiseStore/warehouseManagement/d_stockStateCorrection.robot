*** Settings ***
Library           SeleniumLibrary
Resource          ../resourceMainPage.robot
Resource          resourceWarehouseManagementPage.robot

*** Test Cases ***

Create And Confirm KORM
    Login FranchiseStore
    Select MainPage Menu                                  Towary
    Select Warehouse Management From Header Menu
    Select Left Menu                                      Korekty stanów magazynowych
    Click Create Stock State Correction Document
    Document Should Open                                  KOREKTA STANÓW MAGAZYNOWYCH KORM 
    Input Comments
    Input Good Name In Article Line
    Select Article From Modal List                        2
    Document Should Open                                  KOREKTA STANÓW MAGAZYNOWYCH KORM 
    Input Quantity In Article Line Correction Doc         8
    Confirm Document
    Document Should Be Confirmed
    [Teardown]    Close Browser
