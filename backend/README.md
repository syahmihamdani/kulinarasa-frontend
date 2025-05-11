# Kulinarasa Backend

## Framework
    node JS

## Package
* express
* pg (node-postgres)
* dotenv
* bcrypt
* cloudinary

## Tables
* users  
    fields:  
    1. id - UUID(PK)
    2. name - VARCHAR
    3. email - VARCHAR
    4. password - VARCHAR
    5. created_at - TIMESTAMP
* recipes  
    fields:  
    1. id - UUID (PK)
    2. author_id - UUID (FK ke users-id)
    3. name - VARCHAR
    4. caption - TEXT
    5. image_url - VARCHAR
    6. food_type - ENUM
    7. procedure - TEXT
    8. created_at - TIMESTAMP
* reviews  
    fields:
    1. id - UUID (PK)
    2. user_id - UUID (FK ke user-id)
    3. recipe_id - UUID (FK ke recipe-id)
    4. rating - INT
    5. review_text - TEXT
    6. created_at - TIMESTAMP

### Enum
* type (dessert, main course, appetizer, beverage)  
    digunakan untuk menggambarkan tipe makanan dari resep yang diupload user, bagian dari table recipes

## Endpoint 
* 