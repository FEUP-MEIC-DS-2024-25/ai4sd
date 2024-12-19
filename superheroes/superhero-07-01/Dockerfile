#גרסת פייתון
FROM python:3.9-slim

#ספריית עבודה
WORKDIR /app

#העתק קבצים לספריית עבודה
COPY requirements.txt requirements.txt

#התקנת תלות
RUN pip3 install -r requirements.txt

#העתק פרויקט
COPY . .

#הפעל את האפליקציה
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--reload"]