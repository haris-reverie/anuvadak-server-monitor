var express = require('express');
const axios = require('axios');
const fetch = require('node-fetch');
const {exec} = require('child_process');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * list of servers
 * 1. anuvadak-wms.reverieinc.com
 * 2. anuvadak-api.reverieinc.com
 * 3. anuvadak-broker.reverieinc.com
 */
router.get('/health-check', async (req,res) => {

  const response = {};
  const type = req.query?.type ? req.query?.type : "all";
  const serverStatus = {};

  try {
    const server_to_check = [
      "anuvadak-wms.reverieinc.com",
      "anuvadak-api.reverieinc.com",
      "anuvadak-broker.reverieinc.com"
    ];


    for (const server_url of server_to_check) {
      try {
        const url = `https://${server_url}/`;
        const status = await (await fetch(url)).status;
        if (status !== 200) {
          throw Error("health check failed");
        }
        if (type === "all" || type === "success") {
          serverStatus[server_url] = true;  
        }
      } catch (error) {
        if (type === "all" || type === "fail") {
          serverStatus[server_url] = false;  
        }
        console.log(error);
        response[server_url] = { status: "Failed",error: error.message|"Failed to get request" };
      }
    } 
  } catch (error) {
    console.log(error);
  }

  res.status(200).json(serverStatus);
});

router.get('/cache-size-check', async (req,res) => {
  try {
    exec("cd && du -shm nginx-cache | awk '{print $1}'",(err,stdout,stderr)=>{
      if (err) {
        console.log("ERROR: " ,err);
      }

      if (stdout) {
        console.log(`${stdout/500*100} % of cache-space used`);
      }

      if (stderr) {
        console.log("STDERR", stderr);
      }
    });


    res.json({status:true, message:"Request received"});
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

