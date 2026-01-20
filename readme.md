 

Postman Testing:
...Admin
{
"email": "skmostafa8888@gmail.com",
"password": "Pass123!"
}
.... User

{
  "email": "amanda.clark@example.com",
  "password": "Password123!"
}


_> using Bearar Token : ADMIN and  USER post can be identified:

run file : 


npm run dev
npm seed:admin
npx prisma studio



---> 
if change in prisma Schema : 
run the command:'

npx prisma migrate dev
npx prisma generate