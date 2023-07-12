*** Settings ***
Library           SeleniumLibrary
Resource          ../resourceMainPage.robot
Resource          resourceWarehouseManagementPage.robot

*** Test Cases ***

Create And Confirm WD For Delivery
    Login FranchiseStore
    Select MainPage Menu                                  Towary
    Select Warehouse Management From Header Menu
    Select Left Menu                                      Zwroty
    Click Create Return Document
    Select Type Of Document To Be Created                 Zwrot WD dla dostawy
    Document Should Open                                  ZWROT ZEWNĘTRZNY WD
    Input Comments
    Input Doc Supplier                                    
    Select Delivery Doc
    Document Should Open                                  ZWROT ZEWNĘTRZNY WD
    Select From List Menu                                 Pokaż pozycje
    Select Article From List
    Input Quantity In Article Line                        0
    Confirm Document
    Document Should Be Confirmed
    [Teardown]    Close Browser

Create And Confirm WD 
    Login FranchiseStore
    Select MainPage Menu                                  Towary
    Select Warehouse Management From Header Menu
    Select Left Menu                                      Zwroty
    Click Create Return Document
    Select Type Of Document To Be Created                 Zwrot WD
    Document Should Open                                  ZWROT ZEWNĘTRZNY WD
    Input Comments  
    Input Doc Supplier
    Input Good Name In Article Line
    Select Article From Modal List
    Input Quantity In Article Line
    Confirm Document
    Document Should Be Confirmed
    [Teardown]    Close Browser

Create And Confirm WDZ
    Login FranchiseStore
    Select MainPage Menu                                  Towary
    Select Warehouse Management From Header Menu
    Select Left Menu                                      Zwroty
    Click Create Return Document
    Select Type Of Document To Be Created                 Zwrot WDZ dla dostawy
    Document Should Open                                  ZWROT ZEWNĘTRZNY WDZ                        
    Input Doc Supplier                                    CHAMPION - WARZYWA
    Select Delivery Doc
    Document Should Open                                  ZWROT ZEWNĘTRZNY WDZ
    Select From List Menu                                 Pokaż pozycje
    Select Article From List
    Input Comments
    Confirm Document
    Document Should Be Confirmed
    [Teardown]    Close Browser



