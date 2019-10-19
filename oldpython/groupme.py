from selenium import webdriver

driver = webdriver.Chrome()

driver.get("https://web.groupme.com/signin")

signin = driver.find_element_by_id("signinUserNameInput")
password = driver.find_element_by_id("signinPasswordInput")

signin.send_keys("notanyoneatall@outlook.com")
password.send_keys("password1234")

click = driver.find_elements_by_class_name("btn-success")
print(len(click))
click[0].click()

while True:
    pass