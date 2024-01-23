**List User**
Type: GET
Header: Authorization: Bearer YOUR_JWT_TOKEN
URL: http://localhost:3000/users/list
Parameter: NA
Details: List all users
**Add User**
Type:POST
Header: Authorization: Bearer YOUR_JWT_TOKEN
URL:http://localhost:3000/users/add
Parameter in Raw JSON: {"name":"Neem","email":"Neem@gmail.com","mobile":"7894561230","password":"123456","status":"active"}
Details: Add new user
**View User**
Type:GET
Header: Authorization: Bearer YOUR_JWT_TOKEN
URL:http://localhost:3000/users/getSingleUser/65a91bc3e8f42dea5fa9fb02
Parameter:NA
Details: View new user
**Edit User**
Type:PUT
Header: Authorization: Bearer YOUR_JWT_TOKEN
URL:http://localhost:3000/users/update/65a91bc3e8f42dea5fa9fb02
Parameter in Raw JSON: {"name":"Jacky","email":"Node4@gmail.com","mobile":"45785445585","password":"123456","status":"active"}
Details: Update existing user
**Delete User**
Type:DELETE
Header: Authorization: Bearer YOUR_JWT_TOKEN
URL:http://localhost:3000/users/delete/65a91bc3e8f42dea5fa9fb02
Parameter:NA
Details: Delete existing user
**User Login**
Type: POST
URL:http://localhost:3000/auth
Parameter in Raw JSON: {"email":"Neem@gmail.com","password":"123456"}
Details: Login user and return JWT token
**Change Status**
Type: PUT
URL:http://localhost:3000/session8/change-status/65a91bc3e8f42dea5fa9fb02
Parameter in Raw JSON: {"status":"pending"}
Details: Change user status