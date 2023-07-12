*** Settings ***
Library           SeleniumLibrary

*** Keywords ***

Input Article
    [Arguments]   ${article}
    Input Text    //div[1]/div/div/div/div[1]/div/fieldset/input    ${article}

Article Should Be Found
    Wait Until Page Contains Element    xpath: //*[contains(text(), "LISTA TOWARÓW")]    timeout=60s

Click Search Article Button From Menu
    Click Element                       xpath: //div[1]/div/fieldset/span[1]

Enter First Article From List
    Click Element                       xpath://table/tbody/tr[1]/td[8]

Article Cart Should Be Open
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage
    Wait Until Page Contains Element    xpath: //span[contains(text(), "Stawka VAT")]    timeout=60s

Click Add To Cart Button
    Click Element                       xpath://span[@class="addToCart"]
    
Close Info Alert
    Click Element                       xpath://div[@class="flBtnClose"] 

