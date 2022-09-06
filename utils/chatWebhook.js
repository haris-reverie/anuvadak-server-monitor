const { default: axios } = require("axios");

const ANV_MONGO_WEBHOOK = "https://chat.googleapis.com/v1/spaces/AAAAqO8QFIE/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=Eh_VWXABbkU8JxyP5mzx3QhNRF2b_DCs_beDog_Z57s%3D";
const ANV_2_HEALTH_CHECK_WEBHOOK = "https://chat.googleapis.com/v1/spaces/AAAAqO8QFIE/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=DCr5SFItEph_XMvvVcQbQU44i0ZIcSKuWfbsNGkKIhA%3D";
const ANV_3_HEALTH_CHECK_WEBHOOK = "https://chat.googleapis.com/v1/spaces/AAAAqO8QFIE/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=fysvsKEZAB52JKiLoqx3tZRmn_bW_7c9E5rr2CRGBhQ%3D";

const sendMongoBackupMessage = async ()=>{
    try {
        const date = new Date();
        var data = {
          cards: [
            {
              header: {
                title: "ANV-3.0 Mongo Backup Alert",
                imageUrl:
                  "https://d3cy9zhslanhfa.cloudfront.net/media/3800C044-6298-4575-A05D5C6B7623EE37/0ED35984-8146-41EA-999110E2099C206A/thul-876298A8-C3E1-487D-8AD6920174E16D78.png",
              },
              sections: [
                {
                  widgets: [
                    {
                      textParagraph: {
                        text: `MongoDB Backup done for <b>${date.toLocaleDateString("en-IN",{weekday: "long", year: "numeric", month: "long", day: "numeric"})}</b> at <b>${date.toLocaleTimeString("en-IN",{hour: '2-digit', minute: '2-digit'}).toUpperCase()}</b>`,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };
        var config = {
          method: "post",
          url: ANV_MONGO_WEBHOOK,
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        await axios(config);
        return true;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

const sendServerHealthMessage = async (result,version=2)=>{
    try {
        let message = "";
        for (const url in result) {
            if (Object.hasOwnProperty.call(result, url)) {
                const element = result[url];
                const color = element ? `"#008000"`: `"#ff0000"`;
                const status = element ? `Server Up`: `Server Down`
                message = message + `• <b>${url}</b> : <font color=${color} >${status}</font> \n`
            }
        }
        if (!message) {
            return true;
        }
        var data = JSON.stringify({
          cards: [
            {
              header: {
                title: `ANV-${version === 2? '2' : '3'}.0 Server Status`,
                subtitle: "Server Health-Check Status",
                // imageUrl:
                //   "https://hlassets.paessler.com/common/files/preview/server-health-monitoring.png",
              },
              sections: [
                {
                  widgets: [
                    {
                      textParagraph: {
                        text: message,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        });

        var config = {
          method: "post",
          url: version === 2 ? ANV_2_HEALTH_CHECK_WEBHOOK : ANV_3_HEALTH_CHECK_WEBHOOK,
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };
        
        await axios(config);
        return true;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

const sendCacheUsageMessage = async (message)=>{
    try {
        var data = {
            cards: [
              {
                header: {
                  title: "ANV-3.0 Nginx Cache Alert",
                  imageUrl:
                    "https://w7.pngwing.com/pngs/816/934/png-transparent-nginx-hd-logo-thumbnail.png",
                },
                sections: [
                  {
                    widgets: [
                      {
                        textParagraph: {
                          text: message,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          };
          var config = {
            method: "post",
            url: ANV_3_HEALTH_CHECK_WEBHOOK,
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };
  
          await axios(config);
          return true;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

module.exports = {
    sendMongoBackupMessage,
    sendServerHealthMessage,
    sendCacheUsageMessage
}