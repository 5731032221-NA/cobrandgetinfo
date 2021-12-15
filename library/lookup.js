const config = require('./config');
//const sql =  require('mssql/msnodesqlv8');

module.exports.inquiryMCard = (async function (CUST_ID, date, res) {

    const pool = await new require('node-jt400').pool(config);
    st = await ("Select mvm01p.MBCODE,mvm01p.MBEXP,mvm01p.MBTTLE,mvm01p.MBTNAM,mvm01p.MBTSUR,mvm01p.MBESUR,mvm01p.MBENAM,mvm01p.MBESUR,mvm01p.MBMEMC, mvm01p.MBTAPO,  mcrs2p.MBDATT,mcrs2p.MBCEXP, mcrs2p.MBPOINT From MBRFLIB/MVM01P As mvm01p Left Join MBRFLIB/MCRS2P mcrs2p  On mvm01p.MBCODE = mcrs2p.MBCODE  Where mvm01p.MBCODE not in (select MBCODE from MBRFLIB/MCRTA28P) and (mvm01p.MBID = '" + CUST_ID + "' OR mvm01p.MBPASS = '" + CUST_ID + "')  and mvm01p.MBMEMC != 'AT'  and mvm01p.MBEXP > " + date + " Order By case  mvm01p.MBMEMC when '10' then  mvm01p.MBMEMC END ASC ,case  mvm01p.MBMEMC when '38' then  mvm01p.MBMEMC END ASC ,case  mvm01p.MBMEMC when '35' then  mvm01p.MBMEMC END ASC ,case  mvm01p.MBMEMC when '31' then  mvm01p.MBMEMC END ASC ,case  mvm01p.MBMEMC when 'BT' then  mvm01p.MBMEMC END ASC ,case  mvm01p.MBMEMC when 'GF' then  mvm01p.MBMEMC END ASC , case  mvm01p.MBMEMC when 'MC' then  mvm01p.MBMEMC END DESC ,  mvm01p.MBDAT DESC");
    st2 = await ("Select * From MBRFLIB/MVM01P As mvm01p Left Join MBRFLIB/MCRS2P mcrs2p  On mvm01p.MBCODE = mcrs2p.MBCODE  Where mvm01p.MBCODE not in (select MBCODE from MBRFLIB/MCRTA28P) and (mvm01p.MBID = '" + CUST_ID + "' OR mvm01p.MBPASS = '" + CUST_ID + "')  and mvm01p.MBMEMC != 'AT'  and mvm01p.MBEXP > " + date + " Order By case  mvm01p.MBMEMC when '10' then  mvm01p.MBMEMC END ASC ,case  mvm01p.MBMEMC when '38' then  mvm01p.MBMEMC END ASC ,case  mvm01p.MBMEMC when '35' then  mvm01p.MBMEMC END ASC ,case  mvm01p.MBMEMC when '31' then  mvm01p.MBMEMC END ASC ,case  mvm01p.MBMEMC when 'BT' then  mvm01p.MBMEMC END ASC ,case  mvm01p.MBMEMC when 'GF' then  mvm01p.MBMEMC END ASC , case  mvm01p.MBMEMC when 'MC' then  mvm01p.MBMEMC END DESC ,  mvm01p.MBDAT DESC");
    try {
        q3 = await pool.query(st);
        if (await q3.length > 0) {
            return await q3;
        } else {
            res.status(200).send({
                "RESP_CDE": "301",
                "RESP_MSG": "No record in Mcard"
            });
        }
    } catch {
        res.status(200).send({
            "RESP_CDE": "304",
            "RESP_MSG": "Cannot connect Database"
        });
    }

})
module.exports.inquiryPCard = (async function (MBCODE,res) {
    const pool = await new require('node-jt400').pool(config);
    st = await ("Select * From MBRFLIB/PM200MP RIGHT JOIN MBRFLIB/PM110MP On PM200MP.PNNUM = PM110MP.PNNUM  Where MBCODE = '" + MBCODE +"' and PNSTS ='' ");
    try {
        q3 = await pool.query(st);
        return await q3;
    } catch {
        res.status(200).send({
            "RESP_CDE": "304",
            "RESP_MSG": "Cannot connect Database"
        });
    }
})