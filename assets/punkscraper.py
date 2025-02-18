import json
from bs4 import BeautifulSoup, NavigableString
import requests

# last quiz on jetpunk
highestQuiz = 233

try:
    with open("questions.json", "r") as file:
        data = json.load(file)
except (FileNotFoundError, json.JSONDecodeError):
    data = {}

question_num = 1

quizNumber = 1
while quizNumber <= highestQuiz:
    page = requests.get("https://www.jetpunk.com/quizzes/general-knowledge-quiz-" + str(quizNumber))
    bs = BeautifulSoup(page.text, "html.parser")
    
    allObjects = bs.find_all("div", attrs={"class":"h"})

    # prune objects
    for o in allObjects:
        # object is a "Hint" or "Answer" title
        if len(o.parent.get("class")) != 0:
            if o.parent.get("class")[0] == "gx1":
                allObjects.remove(o)

        # remove multi-answer questions
        if (o.parent.has_attr("rowspan")):
            current = o
            for i in range(int(o.parent.get("rowspan"))):
                next = current.find_next("div", attrs={"class":"h"})
                # print("Removing", next)
                allObjects.remove(next)
                current = next
            allObjects.remove(o)

        # remove objects with underline answers 
        elif o.parent.has_attr("data-answer"):
            if (len(list(o.children)) != 1):
                for child in o.children:
                    if (child.name == "span"):
                        # try:
                        #     allObjects.remove(o.find_previous("div", attrs={"class":"h"})) # remove assoc. question
                        # except:
                        #     print("Quiz number " + str(quizNumber) + "; unable to remove a previous element from ", o)
                        #     pass
                        allObjects.remove(o.find_previous("div", attrs={"class":"h"}))
                        allObjects.remove(o) # remove underline answer
                        break


    # print("\n\n" + "OBJECTS AFTER PRUNE:")
    # for i in allObjects:
    #     print(i)

    for obj in allObjects:
        if not obj.parent.has_attr("data-answer") and not obj.get_text() == "Answer": # pass if the object is a question. also another check for answer column because for some reason missed above?
            questionObject = obj
            answerObject = obj.find_next("div", attrs={"class":"h"})

            new_data = {
                str(question_num):{
                    "question": questionObject.get_text(separator=" ", strip=True).replace("\n", " ").strip(),
                    "answer": answerObject.get_text(separator=" ", strip=True).replace("\n", " ").strip().replace("-", " ").replace(".", "").replace("'", "").split(" / ")
                }
            }
                
            data.update(new_data)
                
            question_num += 1    

    quizNumber += 1


with open("questions.json", "w") as file:
    json.dump(data, file, indent=4)

