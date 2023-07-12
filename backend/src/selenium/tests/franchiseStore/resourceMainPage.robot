*** Settings ***
Library           SeleniumLibrary

*** Keywords ***

Select MainPage Menu
    [Arguments]    ${title}
    Click Element                       xpath: //*[contains(text(), "${title}")]
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage        timeout=120s

Select Orders From Header Menu
    Wait Until Element Is Enabled       xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[5]/a/span[2]     timeout=120s
    TRY
        Click Element                       xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[5]/a/span[2]
    EXCEPT 
        Sleep    5s
        Click Element                       xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[5]/a/span[2]
    END

Select Assortment From Header Menu
    Wait Until Element Is Visible      xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[3]/a/span         timeout=120s
    TRY
        Click Element                       xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[3]/a/span
    EXCEPT
        Sleep    5s
        Click Element                       xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[3]/a/span
    END
    

Select Price Management From Header Menu
    Wait Until Element Is Enabled       xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[4]/a/span        timeout=120s
    TRY
        Click Element                       xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[4]/a/span    
    EXCEPT
        Sleep    5s
        Click Element                       xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[4]/a/span
    END
    
    
Select Warehouse Management From Header Menu
    Wait Until Element Is Enabled       xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[6]/a/span        timeout=120s
    TRY
        Click Element                       xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[6]/a/span
    EXCEPT
        Sleep    5s
        Click Element                       xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[6]/a/span
    END
    

Select Cart From Header
    Wait Until Element Is Enabled       xpath: //div[4]/div[1]/div[1]/div[3]/div/div[2]/div[1]      timeout=120s
    Click Element                       xpath: //div[4]/div[1]/div[1]/div[3]/div/div[2]/div[1]

Cart Page Should Be Open
    Wait Until Page Contains Element    xpath: //*[contains(text(), "ZAWARTOŚĆ KOSZYKA/TYMCZASOWEJ LISTY TOWARÓW")]    timeout=120s

Assortment Page Should Be Open
    Wait Until Page Contains Element    xpath: //*[contains(text(), "Towary dla wag")]    timeout=120s

Select From Cart List Menu
    [Arguments]    ${item}
    Click Element                       xpath://li[@class="menuTitle"]
    Click Element                       xpath: //*[contains(text(), "${item}")]   

Select Orders Menu
    [Arguments]    ${title}
    Wait Until Element Is Not Visible   class:blockUI blockMsg blockPage                    timeout=120s
    IF    "${title}" == "Zamówienia"
        Wait Until Element Is Enabled   xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[5]/ul/div/li[2]/div/ul/li[3]/a/span    timeout=120s
        Click Element                   xpath: //div[4]/div[1]/div[1]/div[2]/ul/li[5]/ul/div/li[2]/div/ul/li[3]/a/span
    ELSE 
        Wait Until Element Is Enabled   xpath: //*[contains(text(), "${title}")]            timeout=120s
        Click Element                   xpath: //*[contains(text(), "${title}")]
    END

Click Confirm Button
    Wait Until Page Contains Element    xpath://*[@value="Zatwierdź"]   timeout=10s
    Click Element                       xpath://*[@value="Zatwierdź"]

Close Info Dialog
    Wait Until Page Contains Element    xpath: //div[contains(@class, "flBtnClose")]   timeout=10s
    Click Element                       xpath: //div[contains(@class, "flBtnClose")]