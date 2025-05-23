# Kulinarasa Backend

## Framework
    node JS

## Package
* express
* pg (node-postgres)
* dotenv
* bcrypt
* cloudinary
* multer
* cors

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
### /user/register  
- Membuat akun baru bagi user  
- Method : POST
- req : query (email, password, name)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * name
        * email
        * password (terenkripsi dengan menggunakan bcrypt)
        * created_at
### /user/login  
- User login, (mengambil data user dengan email, kemudian mencocokkan password)  
- Method : POST 
- req : query (email, password)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * name
        * email
        * password (terenkripsi dengan menggunakan bcrypt)
        * created_at
### /user/:id
- Mengambil data user berdasarkan id yang diberikan  
- Method : GET
- req : param (id)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * name
        * email
        * password (terenkripsi dengan menggunakan bcrypt)
        * created_at
### /recipe/create
- Mengupload recipe baru  
- Method : POST
- req : body (name, caption, image(file), author_id, food_type, procedure, is_public, ingredients)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * author_id
        * name
        * caption
        * image_url
        * food_type
        * ingredients
        * procedure
        * is_public
        * created_at
### /recipe/public
- Mendapatkan semua data recipe yang bersifat public (is_public === true)
- Method : GET
- req : none
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * author_name
        * name
        * caption
        * image_url
        * food_type
        * created_at
        * total_reviews
        * average_rating
### /recipe/:id
- Mencari recipe berdasarkan ID
- Method : GET
- req : param (id)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * author_name
        * name
        * caption
        * image_url
        * food_type
        * ingredients
        * procedure
        * is_public
        * created_at
        * total_reviews
        * average_rating
### /recipe/delete/:id
- menghapus recipe berdasarkan id
- Method : DELETE
- req : param (id)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * author_id
        * name
        * caption
        * image_url
        * food_type
        * ingredients
        * procedure
        * is_public
        * created_at
### /recipe/search/:word
- Mencari resep berdasarkan nama 
- Method : GET
- req : param (word)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * author_name
        * name
        * caption
        * image_url
        * food_type
        * created_at
        * total_reviews
        * average_rating
### /recipe/byuser/:id
- Mencari recipe berdasarkan ID user
- Method : GET
- req : param (id)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * author_name
        * name
        * caption
        * image_url
        * food_type
        * ingredients
        * procedure
        * is_public
        * created_at
        * total_reviews
        * average_rating
### /recipe/update/text
- Mengupdate isi dari resep (hanya text)
- Method : PUT
- req : body (id, name, caption, food_type, ingredients, procedure, is_public)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * author_id
        * name
        * caption
        * image_url
        * food_type
        * ingredients
        * procedure
        * is_public
        * created_at
### /recipe/update/image
- Mengupdate isi dari resep (hanya gambar)
- Method : PUT
- req : body (id, image(file))
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * author_id
        * name
        * caption
        * image_url
        * food_type
        * ingredients
        * procedure
        * is_public
        * created_at
### /review/create
- Membuat review baru
- Method : POST
- req : body (recipe_id, user_id, rating, review_text)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * user_id
        * recipe_id
        * rating
        * review_text
        * created_at
### /review/byrecipe/:id
- Mengambil recipe berdasarkan id
- Method : GET
- req : param (id)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * user_id
        * recipe_id
        * rating
        * review_text
        * created_at
### /review/byuser/:id  
- mendapatkan review berdasarkan user id
- Method : GET
- req : param (id)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * user_id
        * recipe_id
        * rating
        * review_text
        * created_at
### /review/update
- Method : PUT
- req : body (id, rating, review_text)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * user_id
        * recipe_id
        * rating
        * review_text
        * created_at
### /review/delete/:id
- Method : DELETE
- req : param (id)
- return : 
    * success (true/false)
    * message
    * payload 
        * id
        * user_id
        * recipe_id
        * rating
        * review_text
        * created_at

