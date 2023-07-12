*** Settings ***
Library           SeleniumLibrary

*** Variables ***

@{_tmp}
    SERVER:${SERVER}
    BROWSER:${BROWSER}
    VALID_USER:${VALID USER}
    VALID_PASSWORD:${VALID PASSWORD}
    FRANCHISE_STORE:${FRANCHISE STORE}
${DELAY}             0.3
${LOGIN URL}         http://${SERVER}/esambo/login?0
${INVALID USER}      invalidUser
${INVALID PASSWORD}  invalidPass
  
# robot --variable SERVER:10.5.1.125:17013 --variable BROWSER:headlessfirefox --variable VALID_USER:bartlomiej.babula.001 --variable VALID_PASSWORD:Szakal666 --variable FRANCHISE_STORE:A88  --suite orders .


*** Keywords ***
Open Browser To Login Page
    Open Browser    ${LOGIN URL}    ${BROWSER}    
    Maximize Browser Window
    Set Selenium Speed    ${DELAY}
    Login Page Should Be Open

Login Page Should Be Open
    Title Should Be    Logowanie do eSambo


Input Username
    [Arguments]    ${username}
    Input Text    j_username    ${username}

Input Password Login
    [Arguments]    ${password}
    Input Text    j_password    ${password}

Submit Credentials
    Click Button    Zaloguj

Select Shop Should Be Open
    Page Should Contain Element    xpath: //*[contains(text(), "Sklep")]


Error Login Should Be Show
    Page Should Contain Element    class: feedbackPanelERROR

Select Shop
    [Arguments]    ${store}
    Click Element  id:id2_title
    Click Element  xpath: //span[text()[contains(.,'${store}')]]
    Click Button   name: login-button


Login FranchiseStore
    Open Browser To Login Page
    Input Username            ${VALID USER}
    Input Password Login      ${VALID PASSWORD}
    Submit Credentials
    Select Shop               ${FRANCHISE STORE}
    Select Frame    tag: iframe

Refresh Until
    [Arguments]    ${endLocator}=xpath: //*[contains(@class, "btnClose")] 
    WHILE  True    limit=20    
        Sleep            2s
        TRY
            Click Element        xpath: //div[contains(@class, "flBtnClose")]
        EXCEPT
            TRY 
                Click Element                      ${endLocator}
                BREAK
            EXCEPT
                Click Element    xpath: //*[contains(@class, "refresh")] 
            END   
        END 
    END
    
        
    