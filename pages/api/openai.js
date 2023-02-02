import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const sql = req.body.sql || '';
  if (sql.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter valid SQL",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(sql),
      temperature: 0.6,
    });
    const prediction = completion.data.choices[0].text
    res.status(200).json({ result: prediction });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(sql) {
  return `As a senior analyst, summarise the following SQL code into a few words of plain english:

  1)
  SQL: "SELECT A.CustomerName AS CustomerName1, B.CustomerName AS CustomerName2, A.City
  FROM Customers A, Customers B
  WHERE A.CustomerID <> B.CustomerID
  AND A.City = B.City
  ORDER BY A.City;"
  Summary: Return customers who are from the same city.
  
  2)
  SQL: "SELECT City FROM Customers
  UNION
  SELECT City FROM Suppliers
  ORDER BY City;"
  Summary: Return the cities (only distinct values) from both the "Customers" and the "Suppliers" table.
  
  3)
  SQL: "SELECT COUNT(CustomerID), Country
  FROM Customers
  GROUP BY Country;"
  Summary: Count the number of customers from each country.
  
  4)
  SQL: "SELECT nname
  FROM Nurse N
  WHERE NOT EXISTS
      (    (SELECT H.hid
            FROM Hospital H
            WHERE H.town = 'Toronto')
       EXCEPT
           (SELECT W.hid
           FROM WorksIn W
           WHERE N.nid = W.nid))"
  Summary: Return the names of nurses who don't have any hospitals in Toronto they don't work in.
  
  5)
  SQL: "${sql}"
  Summary:`;
}
