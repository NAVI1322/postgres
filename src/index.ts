import { Client } from "pg";

const client = new Client( {
    connectionString:"postgresql://postgres:mysecretpassword@localhost/postgres"
})



async function createUserTable()
{
   await client.connect();
    const result  = await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `)
    console.log(result)
}




async function insertData(username: string, email: string, password: string)
{

    // This is an insecure way to store data in your tables. 
// When you expose this functionality eventually via HTTP, someone can do an SQL INJECTION to get access to your data/delete your data.

    // try {
    //     await client.connect(); // Ensure client connection is established
    //     const insertQuery = "INSERT INTO users (username, email, password) VALUES ('username3', 'user1@example.com', 'user\_password');";
    //     const res = await client.query(insertQuery);
    //     console.log('Insertion success:', res); // Output insertion result
    //   } catch (err) {
    //     console.error('Error during the insertion:', err);
    //   } finally {
    //     await client.end(); // Close the client connection
    //   }
    // }
    


     // Sql injection to prevent attacks on db 
     // we tell the postgres a different way ie $1 indicating the particular value
 
    try {
        await client.connect(); // Ensure client connection is established
        // Use parameterized query to prevent SQL injection
        const insertQuery = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
        const values = [username, email, password];
        const res = await client.query(insertQuery, values);
        console.log('Insertion success:', res); // Output insertion result
      } catch (err) {
        console.error('Error during the insertion:', err);
      } finally {
        await client.end(); // Close the client connection
      }
    }

    insertData('username51', 'user51@example.com', 'user1_password').catch(console.error);



    // this is query data 
  // question - Write a function getUser that lets you fetch data from the database given a email as input.


    async function getUser(email: string) {

  try {
         // Ensure client connection is established
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await client.query(query, values);  // for data security 
    
    // simple validation error handling

    if (result.rows.length > 0) {
      console.log('User found:', result.rows[0]); // Output user data
      return result.rows[0]; // Return the user data
    } else {
      console.log('No user found with the given email.');
      return null; // Return null if no user was found
    }
  } catch (err) {
    console.error('Error during fetching user:', err);
    throw err; // Rethrow or handle error appropriately
  } finally {
    await client.end(); // Close the client connection
  }
}

// Example usage
// getUser('user3@example.com').catch(console.error);



// get all the data from the backend

async function getAllData()
{

    const sqlString = "Select * From users"

    const result =  await client.query(sqlString);

    try{
        if(result.rows.length>0)
        {
            console.log(result.rows)
        }
        else
        console.log("no user found")
        
    }
    catch(err)
    {
        console.error("error found " + err)
        throw err;
    }
    finally
    {
        client.end();
    }
}

getAllData()