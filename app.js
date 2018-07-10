restify = require('restify');
builder = require('botbuilder');
request = require('request');
const nodemailer = require('nodemailer');
// const xoauth2 = require('xoauth2');
var menu = require("./menuConfig.json");
var mainMenu = menu.main;
server = restify.createServer();



server.listen(process.env.port || process.env.PORT || "3978", function () {
    console.log('%s listening to %s', server.name, server.url);
});


// Bot Framework Service

connector = new builder.ChatConnector({
    appId: "18ed487a-4cf9-429b-be93-8805ae030677",
    appPassword: "vdwDEIY48+:_bqugYIE107;",
});

server.post('/api/messages', connector.listen());

bot = new builder.UniversalBot(connector, [

    function (session) {
        var options = {
            method: "GET",
            url: "http://ec2-13-250-101-134.ap-southeast-1.compute.amazonaws.com/api/members/",
            headers: { 'content-type': 'application/json' }
        }
        request(options, function (error, response, body) {
            alldata = JSON.parse(body)
            session.beginDialog('mainmenu')
            console.log(alldata)

        })
    }])


bot.dialog('register', [
    function (session) {
        session.dialogData.register = ({ item: 'register' })
        builder.Prompts.text(session, '請輸入帳號')

    },
    function (session, results) {
        session.dialogData.register.account = results.response
        var validmessage = ''
        for (var i = 0; i < alldata.length; i++) {
            if (session.dialogData.register.account == alldata[i].username) {
                console.log(session.dialogData.register.account, alldata[i].username, i, alldata.length)
                validmessage = '此帳號已有請重新輸入'
                i = alldata.length
            }
        }
        if (validmessage == '此帳號已有請重新輸入') {
            session.send(validmessage)
            session.replaceDialog('mainmenu')
        }
        else {
            builder.Prompts.text(session, '請輸入密碼')
        }


    },


    function (session, results) {
        session.dialogData.register.password = results.response
        builder.Prompts.text(session, '請輸入電子郵件')

    },
    function (session, results,next) {
        session.dialogData.register.email = results.response
        var check=new RegExp('^.+@.+\.{2,3}$')
          if(!check.test(session.dialogData.register.email))
        {
            console.log('11')
            session.send('電子郵件格式錯誤，請重新輸入')
            session.replaceDialog('mainmenu')
        }
        else{
            next()
        }
    },
    function (session, results) {
        var validmessage = ''
        for (var i = 0; i < alldata.length; i++) {
            if (session.dialogData.register.email == alldata[i].useremail) {
                validmessage = '電子郵件已註冊，請重新輸入'
                i = alldata.length
            }
        }
        if (validmessage == '電子郵件已註冊，請重新輸入') {
            session.send(validmessage)
            session.replaceDialog('mainmenu')
        }
        else {
            builder.Prompts.text(session, '請輸入姓名')
        }
    },
    function(session,results){
        seesion.dilogData.register.name=results.response
        builder.Prompts.time(session, '請輸入生日(格式為XXXX-XX-XX)')
    },
    function (session, results) {
        session.dialogData.register.birth = results.response.entity
        var order = {
            account: session.dialogData.register.account,
            password: session.dialogData.register.password,
            email: session.dialogData.register.email,
            name: seesion.dilogData.register.name,
            birth: session.dialogData.register.birth,
        }
        console.log(order)
        var options = {
            method: "POST",
            url: "http://ec2-13-250-101-134.ap-southeast-1.compute.amazonaws.com/api/members/",
            form: {
                username: order.account,
                password: order.password,
                useremail: order.email,
                name:order.name,
                userbirth: order.birth,
            },
            headers: { 'content-type': 'application/json' }
        }
        request(options, function (error, response, body) {
            console.log(body)
            alldata = JSON.parse(body)
        })
        session.send('註冊成功!')
        console.log(alldata)
        var msg = new builder.Message(session)
            .suggestedActions(
                builder.SuggestedActions.create(
                    session, [
                        builder.CardAction.imBack(session, "登入🔑", "登入🔑"),
                        builder.CardAction.imBack(session, "購物👜", "購物👜"),
                        builder.CardAction.imBack(session, "首頁⛱️", "首頁⛱️"),
                    ]
                ))
        session.endDialog(msg)
    }
]).triggerAction({ matches: /^註冊📝$/ })

bot.dialog('login', [
    function (session) {
        session.conversationData.login = ({ item: 'login' })
        builder.Prompts.text(session, '請輸入帳號')
    },
    function (session, results) {
        session.conversationData.login.account = results.response
        builder.Prompts.text(session, '請輸入密碼')
    },
    function (session, results) {
        session.conversationData.login.password = results.response
        var order = {
            account: session.conversationData.login.account,
            password: session.conversationData.login.password
        }

        var msg1 = new builder.Message(session)
            .suggestedActions(
                builder.SuggestedActions.create(
                    session, [
                        builder.CardAction.imBack(session, "登出🔓", "登出🔓"),
                        builder.CardAction.imBack(session, "首頁⛱️", "首頁⛱️"),
                        builder.CardAction.imBack(session, "購物👜", "購物👜")
                    ]
                ))
        var msg2 = new builder.Message(session)
            .suggestedActions(
                builder.SuggestedActions.create(
                    session, [
                        builder.CardAction.imBack(session, "登入🔑", "登入🔑"),
                        builder.CardAction.imBack(session, "忘記密碼😱", "忘記密碼😱"),
                        builder.CardAction.imBack(session, "首頁⛱️", "首頁⛱️"),
                    ]
                ))
        var options = {
            method: "GET",
            url: "http://ec2-13-250-101-134.ap-southeast-1.compute.amazonaws.com/api/members/",
            headers: { 'content-type': 'application/json' }
        }
        request(options, function (error, response, body) {
            memberdata = JSON.parse(body)
            console.log(memberdata)
            var validmessage = ''
            for (var i = 0; i < memberdata.length; i++) {
                if (session.conversationData.login.account == memberdata[i].username)
                    if (session.conversationData.login.password == memberdata[i].password) {
                        validmessage = '登入成功!'
                        i = memberdata.length
                    }
            }
            if (validmessage == '') {
                session.endConversation()
                session.send('帳號或密碼錯誤，請重新輸入')
                session.send(msg2)
            }
            else {
                session.send('登入成功!')
                session.replaceDialog('mainmenu')
                // session.send(msg1)
                session.endDialogWithResult({ response: session.conversationData.login })
            }

        })

    }]).triggerAction({ matches: /^登入🔑$/ })

bot.dialog('forget', [
    function (session) {
        builder.Prompts.text(session, '請輸入email')
    },

    function (session, results) {
        validmessage = ''
        session.dialogData.email = results.response
        for (var i = 0; i < alldata.length; i++) {
            if (session.dialogData.email == alldata[i].useremail) {
                validmessage = '驗證成功!'
                i = alldata.length - 1
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: 'testbotmail0706@gmail.com',
                        clientId: '741548107842-dtug0l7uin5l56egm2anqk8gm13jbghj.apps.googleusercontent.com',
                        clientSecret: 'g20YsRQ5AVaoRiyXDeOk3bfl',
                        refreshToken: '1/JcSzPiVNiMevUIs8YmCSSkjCyLVmP69lbNXI_r_voWU',
                        accessToken: 'ya29.GlvwBUxWVvVjuY8X36cSqQ3LKTZvPqPkLJ7KTffpQU-78pBILzF6zdWuZ8UXBeiSvUoSOBl0SMJkGPMSTVsGUsGkAkwtHtbpkaq0WhzCgzs0UacPrfsYH2Wn9Pf7'
                    },
                });
                var mailOptions = {
                    from: 'testbotmail0706@gmail.com',
                    to: session.dialogData.email,
                    subject: '無人商店密碼',
                    text: 'Your password : ' + alldata[i].password
                }

                transporter.sendMail(mailOptions, function (err, res) {
                    if (err) {
                        console.log('Error');
                    } else {
                        console.log('Email Sent');
                    }
                })

            }
        }
        if (validmessage == '驗證成功!') {
            session.send('電子郵件傳送成功')
            session.replaceDialog('mainmenu')
        }
        else {
            session.send('無此電子郵件，請重新輸入')
            session.replaceDialog('mainmenu')
        }
    }
]).triggerAction({ matches: /^忘記密碼😱$/ })

bot.dialog('Contact', [
    function (session) {
        var msg = new builder.Message(session);
        var heroCard = new builder.HeroCard(session)
            .title("第五組")
            .subtitle("無人商店")
            .text("106台北市大安區復興南路一段390號 2,3,15樓")
            .images([builder.CardImage.create(session, "http://joomly.net/frontend/web/images/googlemap/map.png")])
            .buttons([
                builder.CardAction.imBack(session, "AIEN0205@gmail.com", "電子郵件📧"),
                builder.CardAction.imBack(session, "02-631-6666", "聯絡電話📱"),
                builder.CardAction.openUrl(session, "http://ec2-13-250-101-134.ap-southeast-1.compute.amazonaws.com/", "官網📜"),
                builder.CardAction.openUrl(session, "首頁⛱️", "首頁⛱️"),
            ]);
        msg.addAttachment(heroCard);
        session.endDialog(msg);
    }
]).triggerAction({ matches: /^聯絡我們☎️$/ })


bot.dialog('logout', [
    function (session) {
        session.endConversation('登出成功')
        session.replaceDialog('mainmenu')
    },

]).triggerAction({ matches: /^登出🔓$/ })




bot.dialog('mainmenu', [
    function (session) {
        var msg = new builder.Message(session)
            .text('             歡迎來到無人商店!請問需要什麼幫助')

        video = new builder.VideoCard(session)

            .autostart(true)
            .autoloop(true)
        var member = session.conversationData.login
        if (member) {
            video.media([
                { url: 'https://r6---sn-ipoxu-un5d.googlevideo.com/videoplayback?itag=43&signature=111F12AAEF57F377A5A28775BDB9FE613BA6B9CD.64E44A0D994B65FE0047E85FA60EBEDEA8325961&fexp=23709359&sparams=clen,dur,ei,expire,gir,id,initcwndbps,ip,ipbits,ipbypass,itag,lmt,mime,mip,mm,mn,ms,mv,pcm2cms,pl,ratebypass,requiressl,source&ip=2400%3A8901%3A%3Af03c%3A91ff%3Afe98%3A5889&expire=1531210134&requiressl=yes&gir=yes&mime=video%2Fwebm&key=cms1&clen=2022487&lmt=1370870553211424&fvip=6&c=WEB&dur=0.000&ratebypass=yes&source=youtube&ipbits=0&pl=24&ei=NRVEW8XtNInhoAOzxJOIBg&id=o-AHbUxrfohjhTReFjW0oQhrz4SFlD3k1qnGVmCn3LU5bm&title=7-ELEVEN%E3%80%8ACITY%20CAFE%E3%80%8B%E9%9B%86%E9%BB%9E%E9%80%81_%E5%B0%8F%E7%8E%8B%E5%AD%90%E7%AB%A5%E8%A9%B1%E7%A2%97%E7%9B%A4%E7%B5%84&redirect_counter=1&rm=sn-a5mkk7d&req_id=804d4f624f6da3ee&cms_redirect=yes&ipbypass=yes&mip=125.227.255.81&mm=31&mn=sn-ipoxu-un5d&ms=au&mt=1531188434&mv=m&pcm2cms=yes' }
            ])
            video.buttons([
                builder.CardAction.imBack(session, "登出🔓", "登出🔓"),
                builder.CardAction.imBack(session, "購物👜", "購物👜"),
                builder.CardAction.imBack(session, "修改密碼", "修改密碼"),
                builder.CardAction.imBack(session, "聯絡我們☎️", "聯絡我們☎️"),
            ])
        }
        else {
            video.media([
                { url: 'https://r5---sn-ipoxu-un56.googlevideo.com/videoplayback?source=youtube&c=WEB&fvip=5&id=o-AEPWJD197mGveThxcljvEpiyvULesD_onak62VQaa7Bj&gir=yes&clen=7989140&fexp=23709359&expire=1531209447&sparams=clen,dur,ei,expire,gir,id,initcwndbps,ip,ipbits,ipbypass,itag,lmt,mime,mip,mm,mn,ms,mv,pcm2cms,pl,ratebypass,requiressl,source&key=cms1&mime=video%2Fwebm&dur=0.000&lmt=1517288591981973&ratebypass=yes&itag=43&ip=2400%3A8901%3A%3Af03c%3A91ff%3Afe98%3A5889&requiressl=yes&ipbits=0&ei=hhJEW7GlOcGHowO0yqeQBQ&pl=17&signature=5E7280DBDA13994ECF1BF3EEC85915BEBA71FF59.373266AACF2F1ED45D8B6EDA6CCADA0134F529FF&title=7-ELEVEN無人商店&redirect_counter=1&rm=sn-a5mkr7d&req_id=42f86746272ea3ee&cms_redirect=yes&ipbypass=yes&mip=223.136.143.196&mm=31&mn=sn-ipoxu-un56&ms=au&mt=1531187724&mv=m&pcm2cms=yes' }
            ])
            video.buttons([
                builder.CardAction.imBack(session, "登入🔑", "登入🔑"),
                builder.CardAction.imBack(session, "購物👜", "購物👜"),
                builder.CardAction.imBack(session, "註冊📝", "註冊📝"),
                builder.CardAction.imBack(session, "聯絡我們☎️", "聯絡我們☎️"),
            ])
        }
        msg.addAttachment(video)
        session.send(msg)
    }]).triggerAction({ matches: /^首頁⛱️$/ })

bot.dialog('change', [
    function (session) {
        builder.Prompts.text(session, '請輸入舊密碼')
    },
    function (session, results, next) {
        var validmessage = ''
        session.dialogData.password = results.response
        for (var i = 0; i < alldata.length; i++) {
            if (session.dialogData.password == alldata[i].password) {
                var validmessage = '驗證成功'
                session.dialogData.validmessage = validmessage
                changeindex = i + 1
                i = alldata.length
                next()
            }

            else {
                session.send('密碼錯誤，請重新輸入')
                session.beginDialog('mainmenu')
                i = alldata.length
            }
        }

    },
    function (session, results) {
        builder.Prompts.text(session, '請輸入新密碼')
    },
    function (session, results) {
        session.dialogData.newpassword = results.response
        if (session.dialogData.validmessage) {

            options = {
                method: 'PATCH',
                url: `http://ec2-13-250-101-134.ap-southeast-1.compute.amazonaws.com/api/members/${changeindex}/`,
                formData: {
                    password: session.dialogData.newpassword
                },

            }
            request(options, function (error, response, body) {
                alldata = JSON.parse(body)
                console.log(alldata)
            })
        }

    }
]).triggerAction({ matches: /^修改密碼$/ })

bot.dialog('mainMenu', [
    function (session, args) {
        member = session.conversationData.login
        if (member) {
            var promptText;
            if (session.conversationData.orders) {
                promptText = "請問你要再買些什麼?"
            } else {
                var promptText = "請問你要買什麼?"
                session.conversationData.orders = new Array();
            }
            builder.Prompts.choice(session, promptText, mainMenu, { listStyle: builder.ListStyle.button });
            var msg = new builder.Message(session)
            msg.suggestedActions(builder.SuggestedActions.create(
                session, [
                    builder.CardAction.imBack(session, "購物車", "購物車🛒"),
                    builder.CardAction.imBack(session, "結帳", "結帳💲"),
                    builder.CardAction.imBack(session, "首頁⛱️", "回首頁⛱️")
                ]
            ))
            session.send(msg)
        }
        else {
            session.send('請先登入喔!')
            session.replaceDialog('mainmenu')
        }
    },
    function (session, results) {
        session.replaceDialog(mainMenu[results.response.entity]);
    }
]).triggerAction({ matches: /^購物👜$/ })






bot.dialog('drinkMenu', function (session) {
    var msg = new builder.Message(session)
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    var attachments = new Array();

    var url = 'http://ec2-13-250-101-134.ap-southeast-1.compute.amazonaws.com/api/drinks/?format=json';
    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {
            // data is already parsed as JSON:
            var drinks = data
            drinks.forEach(drink => {
                var postBackValue = {
                    dialog: "addToCart",
                    info: {
                        "name": drink.name,
                        "price": drink.price,
                        "image": drink.image
                    }
                }
                var attachment = new builder.HeroCard(session)
                    .title(drink.name)
                    .subtitle(`$${drink.price.toString()}`)
                    .images([builder.CardImage.create(session, drink.image)])
                    .buttons([
                        builder.CardAction.postBack(session, JSON.stringify(postBackValue), "加入購物車🛒")
                    ]);
                attachments.push(attachment);
            });
            msg.attachments(attachments);
            session.endDialog(msg);
        }
    });
    msg.suggestedActions(builder.SuggestedActions.create(
        session, [
            builder.CardAction.imBack(session, "零食", "零食🍔"),
            builder.CardAction.imBack(session, "購物車", "購物車🛒"),
            builder.CardAction.imBack(session, "結帳", "結帳💲"),
            builder.CardAction.imBack(session, "首頁⛱️", "回首頁⛱️"),
        ]
    ));

})
    .triggerAction({ matches: /^飲料$/ });

bot.dialog('foodMenu', function (session) {
    var msg = new builder.Message(session)
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    var attachments = new Array();

    var url = 'http://ec2-13-250-101-134.ap-southeast-1.compute.amazonaws.com/api/foods/?format=json';
    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {
            // data is already parsed as JSON:
            var foods = data
            foods.forEach(food => {
                var postBackValue = {
                    dialog: "addToCart",
                    info: {
                        "name": food.name,
                        "price": food.price,
                        "image": food.image
                    }
                }
                var attachment = new builder.HeroCard(session)
                    .title(food.name)
                    .subtitle(`$${food.price.toString()}`)
                    .images([builder.CardImage.create(session, food.image)])
                    .buttons([
                        builder.CardAction.postBack(session, JSON.stringify(postBackValue), "加入購物車🛒")
                    ]);
                attachments.push(attachment);
            });
            msg.attachments(attachments);
            session.endDialog(msg);
        }
    });
    msg.suggestedActions(builder.SuggestedActions.create(session, [
        builder.CardAction.imBack(session, "飲料", "飲料🥤"),
        builder.CardAction.imBack(session, "購物車", "購物車🛒"),
        builder.CardAction.imBack(session, "結帳", "結帳💲"),
        builder.CardAction.imBack(session, "首頁⛱️", "回首頁⛱️")
    ]));
})
    .triggerAction({ matches: /^零食$/ });


bot.dialog('addToCart', [
    function (session) {
        var info = JSON.parse(session.message.text).info;
        var order = session.dialogData.order = {
            name: info.name,
            price: info.price,
            image: info.image
        }
        builder.Prompts.number(session, `請問「${order.name}」要買幾個?`);
    },
    function (session, results) {
        session.dialogData.order.number = results.response;
        var orders = session.conversationData.orders
        var order = session.dialogData.order
        var flag = true
        orders.forEach(item => {
            if (item.name == order.name) {
                item.number += order.number
                var total = order.price * order.number;
                var orderDetail = `${order.name} x ${order.number} 共 $${total}`;
                session.send("加入購物車成功!\n%s", orderDetail);
                flag = false
            }
        });
        if (flag) {
            var total = order.price * order.number;
            var orderDetail = `${order.name} x ${order.number} 共 $${total}`;
            session.send("加入購物車成功!\n%s", orderDetail);
            session.conversationData.orders.push(order);
        }
        session.replaceDialog("mainMenu", { reprompt: true });
    }
]).triggerAction({
    matches: /^{"dialog":"addToCart".*/
});


bot.dialog("cart", [
    function (session) {
        if (!session.conversationData.orders[0]) {
            session.send("購物車內沒有東西喔!")
            session.replaceDialog("mainMenu", { reprompt: false })
        } else {
            var orders = session.conversationData.orders
            var msg = new builder.Message(session);
            msg.attachmentLayout(builder.AttachmentLayout.carousel);
            var attachments = new Array();
            var i = 0
            orders.forEach(order => {
                var postBackValue = {
                    dialog: "addToCart",
                    info: {
                        "name": order.name,
                        "price": order.price,
                        "image": order.image
                    }
                }
                var attachment = new builder.HeroCard(session)
                    .title(order.name)
                    .subtitle(`$${order.price.toString()} X ${order.number} = $${order.price * order.number}`)
                    .images([builder.CardImage.create(session, order.image)])
                    .buttons([
                        builder.CardAction.postBack(session, JSON.stringify(postBackValue), "想再買一點"),
                        builder.CardAction.postBack(session, "delete" + i, "刪除")
                    ]);
                attachments.push(attachment);
                i += 1
            });
            msg.attachments(attachments);
            // session.endDialog(msg);

            msg.suggestedActions(builder.SuggestedActions.create(session, [
                builder.CardAction.imBack(session, "繼續購物", "繼續購物"),
                builder.CardAction.imBack(session, "結帳", "結帳💲"),
                builder.CardAction.imBack(session, "首頁⛱️", "回首頁⛱️")
            ]));

            session.send(msg)
        }
    }
]).triggerAction({
    matches: /^購物車$/
})

bot.dialog("contiune", function (session) {
    session.replaceDialog("mainMenu", { reprompt: true });
}).triggerAction({
    matches: /^繼續購物$/
})

bot.dialog("delete", function (session) {
    var item = session.message.text
    var index = item.slice(6, 7)
    var orders = session.conversationData.orders
    orders.splice(index, 1)
    session.replaceDialog("cart")
}).triggerAction({
    matches: /delete.*/
})

bot.dialog('shipments', [
    function (session) {
        session.dialogData.shipments = {};
        builder.Prompts.text(session, "請問您的姓名?");
    },
    function (session, results) {
        session.dialogData.shipments.Buyer = results.response;
        builder.Prompts.text(session, "請問您的連絡電話?");
    },
    function (session, results) {
        session.dialogData.shipments.Telephone = results.response;
        builder.Prompts.text(session, "請問您的收貨地址?");
    },
    function (session, results) {
        session.dialogData.shipments.Address = results.response;
        session.endDialogWithResult({
            response: session.dialogData.shipments
        });
    }
]);

bot.dialog('checkOut', [
    function (session) {
        if (session.conversationData.orders.length > 0) {
            session.beginDialog("shipments");
        } else {
            session.send("購物車內沒有東西喔!");
            session.replaceDialog("mainMenu", { reprompt: false });
        }
    },
    function (session, results) {
        var shipments = results.response;
        var orders = session.conversationData.orders
        var msg = new builder.Message(session);
        var items = [];
        var total = 0;
        var number = Math.floor((Math.random() * 100000000) + 1)
        orders.forEach(order => {
            var subtotal = order.price * order.number;
            var item = builder.ReceiptItem.create(session, `$${subtotal}`, `${order.name}`)
                .subtitle(`$${order.price} X ${order.number}`)
            items.push(item);
            total += subtotal;
            var data = {
                "order_number": number,
                "user_name": shipments.Buyer,
                "user_email": shipments.Buyer,
                "product_name": order.name,
                "price": order.price,
                "qt": order.number,
                "image": order.image,
                "datetime":"2018-07-10"
            }
            request.post({
                headers: { 'content-type': 'application/json' },
                url: 'http://ec2-13-250-101-134.ap-southeast-1.compute.amazonaws.com/api/orders/',
                body: JSON.stringify(data)

            }, function (error, response, body) {
                console.log(body)
            });
        });
        var attachment = new builder.ReceiptCard(session)
            .title("您的訂單明細")
            .facts([
                builder.Fact.create(session, number, "訂單編號"),
                builder.Fact.create(session, shipments.Buyer, "訂購人"),
                builder.Fact.create(session, shipments.Telephone, "連絡電話"),
                builder.Fact.create(session, shipments.Address, "配送地址")
            ])
            .items(items)
            .total(`$${total}`);
        msg.addAttachment(attachment)
        session.endConversation(msg);

        session.conversationData.login = ({ item: 'login' })
        session.conversationData.login.acoount = 'account'
        session.conversationData.login.password = 'password'


        var contiune = new builder.Message(session)
        contiune.suggestedActions(builder.SuggestedActions.create(session, [
            builder.CardAction.postBack(session, "new", "繼續購物"),
            builder.CardAction.postBack(session, "首頁⛱️", "回首頁⛱️")
        ]));

        session.send("感謝您的訂購，您的商品將於三天內寄出，謝謝~")
        session.send(contiune)

        // session.replaceDialog("mainMenu",{reprompt:false});
    }
]).triggerAction({
    matches: /^結帳$/
});

bot.dialog("new", function (session) {
    session.replaceDialog("mainMenu", { reprompt: false });
}).triggerAction({
    matches: /^new$/
})




//2.02






