/**
 * ============================================================================
 * DEPRECATED - MongoDB Connection (Node.js Backend)
 * ============================================================================
 * This MongoDB connection is being replaced by SQL Server in the .NET backend.
 * The new backend uses Entity Framework Core with SQL Server.
 * 
 * See: /ByteBattles.Server/src/ByteBattles.Infrastructure/
 * ============================================================================
 */

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/bytebattle", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));
