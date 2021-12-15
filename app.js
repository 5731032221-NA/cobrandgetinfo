const express = require('express')

const app = express();

const lookup = require('./library/lookup');

const bodyParser = require('body-parser');

app.listen(8105, function () {
	console.log('app listening on port 8105!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post('/inquirycobrand', async function (req, res) {

    //check schema of inputs
        //var dt = new Date();
        //dt.setHours(dt.getHours() +7);
        //dt = dt.toISOString();
	var dt = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString();


	var dv = dt.substring(0, 10);

	var date_v = dv.substring(0, 4) + dv.substring(5, 7) + dv.substring(8, 10);

	//logger.debug('Date_V:', date_v);

	var tv = dt.substring(11, 19);
	var hp = tv.substring(0, 2);
	var mp = tv.substring(3, 5);
	var sp = tv.substring(6, 8);

	//console.log('Time-7:', hp);


	//console.log('Time+7:', hp);

	/*if (hp > 23) {

		hp = hp - 24;

	}

	if (hp < 9) {

		hp = '0' + hp.toString();
	} else {

		hp = hp.toString();
	}*/

	var time_v = hp + mp + sp;
	//logger.debug('Time_V:', time_v);

	var dtf = date_v + time_v;

    var curt = new Date();
    console.log(dtf);
    var CUST_ID = req.body.CUST_ID;
    if(typeof CUST_ID == 'undefined'){
        res.status(200);
            res.json({
                "RESP_SYSCDE": 200,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 401,
                "RESP_MSG": "Missing Parameter"
            });
    }
    else if(typeof CUST_ID == 'number' || CUST_ID.length > 13 || CUST_ID.length <= 0 ){
        res.status(200);
            res.json({
                "RESP_SYSCDE": 200,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 402,
                "RESP_MSG": "Invalid Format CUST_ID"
            });
    }
    else{
        console.log('lookup for MCARD on MVM01P');
        datenow = await (curt.getFullYear().toString() + ((curt.getMonth() + 1) < 10 ? '0' : '').toString() + (curt.getMonth() + 1).toString());
        var cards = await lookup.inquiryMCard(CUST_ID,datenow,res);
        console.log('cards = ' + JSON.stringify(cards));
        var firstcard = cards[0];
        console.log('Got First MCard MBCODE(CARD0) =' + cards[0].MBCODE);
        console.log('Got First MCard MBCODE =' + firstcard.MBCODE);
        console.log('Find Partner Card');
        PCards = await lookup.inquiryPCard(firstcard.MBCODE,res);
        if (PCards.length == 0){
            res.status(200);
            res.json({
                "RESP_SYSCDE": 200,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 200,
                "RESP_MSG": "Success",
                "MCARD_NUM": firstcard.MBCODE,
                "CARD_TYPE": firstcard.MBMEMC,
			    "CARD_EXPIRY_DATE": firstcard.MBEXP,
			    "CARD_POINT_BALANCE": firstcard.MBPOINT,
			    "CARD_POINT_EXPIRY": firstcard.MBCEXP,
			    "CARD_POINT_EXP_DATE": firstcard.MBDATT,
                //"CARD_POINT_YEAR_SPEND": firstcard.MBTAPO,
                //"CARD_POINT_MONTH_SPEND":rows[i].
                "PARTNER_CARDS" : "NONE"
            });
        }
        else{
            var cards = []
	        for (var i = 0; i < PCards.length; i++) {
		        await cards.push({
			    "PARTNER_PROD": PCards[i].PNPROD,
			    "PARTNER_NBR": PCards[i].PNNUM,
			    "PARTNER_DETAILS": PCards[i].PNDETAIL,
			    "PARTNER_STATUS": PCards[i].PNSTS,
			    "PARTNER_DATE": PCards[i].CLADTE,
                });
            }
            res.status(200);
            res.json({
                "RESP_SYSCDE": 200,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 200,
                "RESP_MSG": "Success",
                "MCARD_NUM": firstcard.MBCODE,
                "CARD_TYPE": firstcard.MBMEMC,
			    "CARD_EXPIRY_DATE": firstcard.MBEXP,
			    "CARD_POINT_BALANCE": firstcard.MBPOINT,
			    "CARD_POINT_EXPIRY": firstcard.MBCEXP,
			    "CARD_POINT_EXP_DATE": firstcard.MBDATT,
                //"CARD_POINT_YEAR_SPEND": firstcard.MBTAPO,
                //"CARD_POINT_MONTH_SPEND":rows[i].
                "PARTNER_CARDS" : cards
            });
        }
    }
});
