*** Settings ***
Library           SeleniumLibrary
Resource          ../resourceMainPage.robot
Resource          resourcePriceManagementPage.robot

 
*** Test Cases ***

Create And Active Special Offer
    Login FranchiseStore
    Select MainPage Menu                        Towary
    Select Price Management From Header Menu
    Select Left Menu                            Promocje
    Click Create Special Offer
    Click Confirm Button
    Special Offer Should Be Open
    Input Offer Name                            AutomaticSpecialOffer
    Input Description                           TestDescription
    Input Offer Start Data
    Input Offer End Data
    Input Article In Offer                      415421
    Click Search Icon
    Input Article Price In Special Offer        1,66
    Activate Special Offer
    Special Offer Should Be Active
    [Teardown]    Close Browser

Create And Active Quantity Offer
    Login FranchiseStore
    Select MainPage Menu                        Towary
    Select Price Management From Header Menu
    Select Left Menu                            Przeceny ilościowe
    Click Create New Quanitity Offer
    Quantity Offer Should Be Open
    Input Offer Name                            AutomaticOffer
    Input Description                           
    Select From List Menu                       Dodaj nową pozycję
    Input Article In Offer                      485219
    Click Search Icon
    Quantity Offer Should Be Open
    Input Article Price In Quanitity Offer      3.55    
    Input Article Quanitity In Quanitity Offer  12
    Confirm Quanitity Offer
    Quantity Offer Should Be Open
    Activate Quanitity Offer
    Quanitity Offer Should Be Active
    [Teardown]    Close Browser



