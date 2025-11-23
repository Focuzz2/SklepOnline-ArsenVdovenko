# 🛒 SklepOnline

**SklepOnline** to nowoczesny sklep internetowy stworzony w oparciu o **Spring Boot** i **MySQL**, z atrakcyjnym interfejsem, koszykiem i pełną integracją z bazą danych.

---

## 🚀 Funkcjonalności

- Wyświetlanie produktów z bazy danych  
- Nowoczesny interfejs z wysuwanym paskiem bocznym i koszykiem  
- Dodawanie produktów do koszyka  
- Obliczanie całkowitej kwoty zamówienia  
- Formularz zakupu z danymi klienta  
- Responsywny design (działa na komputerze i telefonie)

---

## 🧰 Technologie

| Typ | Użyte narzędzia |
|-----|------------------|
| **Backend** | Spring Boot (Java) |
| **Frontend** | HTML, CSS, JavaScript |
| **Baza danych** | MySQL |
| **Zarządzanie projektem** | Apache Maven |
| **Kontrola wersji** | Git + GitHub |

---

## ⚙️ Instalacja i uruchomienie lokalne

### 1️⃣ Wymagania

Zainstaluj:

- [Java JDK 21](https://www.oracle.com/java/technologies/downloads/)
- [Apache Maven](https://maven.apache.org/download.cgi)
- [MySQL Server + MySQL Workbench](https://dev.mysql.com/downloads/)
- (Opcjonalnie) [Visual Studio Code](https://code.visualstudio.com/) lub IntelliJ IDEA

---

### 2️⃣ Klonowanie repozytorium

git clone https://github.com/Focuzz2/SklepOnline-ArsenVdovenko.git
cd SklepOnline-ArsenVdovenko

---
3️⃣ Utworzenie bazy danych

Otwórz MySQL Workbench

Utwórz bazę danych:

CREATE DATABASE shop;


Zaimportuj plik shop.sql (znajduje się w database/shop.sql):

Server → Data Import → Import from Self-Contained File

Wybierz plik shop.sql

Wybierz bazę shop

Kliknij Start Import

---

4️⃣ Konfiguracja połączenia

Upewnij się, że plik
src/main/resources/application.properties
zawiera:

spring.datasource.url=jdbc:mysql://localhost:3306/shop?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YourPassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

💡 Jeśli masz inne hasło do MySQL – zmień je w spring.datasource.password.

---

5️⃣ Uruchomienie projektu
mvn spring-boot:run

Po poprawnym uruchomieniu zobaczysz w konsoli:

Started ShopApplication in 4.567 seconds

---

6️⃣ Podgląd strony

Otwórz w przeglądarce:

http://localhost:8080/index.html
