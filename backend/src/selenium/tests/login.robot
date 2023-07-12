*** Settings ***
Library           SeleniumLibrary
Resource          resource.robot

*** Test Cases ***
Valid Login
    Open Browser To Login Page
    Input Username            ${VALID USER}
    Input Password Login      ${VALID PASSWORD}
    Submit Credentials
    Select Shop Should Be Open
    [Teardown]    Close Browser



