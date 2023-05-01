const { MongoClient } = require("mongodb");
const {config} = require('dotenv')
config()

const MONGO_URL = process.env.MONGO_URL;

class DBManager {
  constructor() {
    this.client = new MongoClient(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to MongoDB");
      this.db = this.client.db("pyrex");
      this.usersCollection = this.db.collection("users");
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  async createUser(userData) {
    // Create a new document for the user
   const {id, username,avatar,discriminator,email} = userData;
    const newUser = {
      id:id,
      username:username,
      avatar:avatar,
      discriminator:discriminator,
      email:email,
      resi:{
        status:'inActive',
        planType:"None",
        data:{
            dataUsed:0,
            totalData:0,
            remainingData:0,
        },
        orders:[{
            id:0,
            amount:0,
            dataAmount:0,
            plan:"",
            status:""
        }]

      },
      isp:{
        orders:[{
            
            id:0,
            amount:0,
            dataAmount:0,
            plan:"",
            status:""
        }]
      }
    };
    await this.usersCollection.insertOne(newUser);
    return newUser
  }

  async checkDatabase(userData) {
    try {
      let {id} = userData
      const result = await this.usersCollection.findOne({ id: id });
      if (!result) {
        if(userData?.email === undefined) return null
        const user = await this.createUser(userData)
        return user;

      } else {
        return result;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = DBManager;
