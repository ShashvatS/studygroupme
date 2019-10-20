import pyautogui
import time

pyautogui.PAUSE = 0.3

time.sleep(5)

for i in range(3517):
    pyautogui.click()
    pyautogui.press('down')
    pyautogui.press('enter')