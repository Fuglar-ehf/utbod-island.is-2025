export const EmployeeEmailTemplate = (
  municipalityName: string,
  veitaUrl: string,
  to: string,
) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif">
   <head> 
    <meta charset="UTF-8"> 
    <meta content="width=device-width, initial-scale=1" name="viewport"> 
    <meta name="x-apple-disable-message-reformatting"> 
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
    <meta content="telephone=no" name="format-detection"> 
    <title>Nýr vinnsluaðili í Veitu</title> 
    <!--[if (mso 16)]>
      <style type="text/css">
      @font-face {
        font-family: 'IBM Plex Sans';
        font-style: normal;
        font-weight: 300;
        src: local('IBMPlexSans-Light'), url(https://fonts.gstatic.com/s/ibmplexsans/v8/zYX9KVElMYYaJe8bpLHnCwDKjXr8AIFsdP3pBms.woff2) format('woff2');
      }
      @font-face {
        font-family: 'IBM Plex Sans';
        font-style: normal;
        font-weight: 600;
        src: local('IBMPlexSans-SemiBold'), url(https://fonts.gstatic.com/s/ibmplexsans/v8/zYX9KVElMYYaJe8bpLHnCwDKjQ76AIFsdP3pBms.woff2) format('woff2');
      }
      a {text-decoration: none;}
      </style>
      <![endif]--> 
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
    <!--[if gte mso 9]>
  <xml>
      <o:OfficeDocumentSettings>
      <o:AllowPNG></o:AllowPNG>
      <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
  </xml>
  <![endif]--> 
    <!--[if !mso]><!-- --> 
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i" rel="stylesheet"> 
    <!--<![endif]--> 
    <style type="text/css">
  #outlook a {
      padding:0;
  }
  .es-button {
      mso-style-priority:100!important;
      text-decoration:none!important;
  }
  a[x-apple-data-detectors] {
      color:inherit!important;
      text-decoration:none!important;
      font-size:inherit!important;
      font-family:inherit!important;
      font-weight:inherit!important;
      line-height:inherit!important;
  }
  .es-desk-hidden {
      display:none;
      float:left;
      overflow:hidden;
      width:0;
      max-height:0;
      line-height:0;
      mso-hide:all;
  }
  [data-ogsb] .es-button {
      border-width:0!important;
      padding:10px 20px 10px 20px!important;
  }
  [data-ogsb] .es-button.es-button-1 {
      padding:18px 24px!important;
  }
  @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
  </style> 
   </head> 
   <body style="width:100%;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
    <div class="es-wrapper-color" style="background-color:#F6F6F6"> 
     <!--[if gte mso 9]>
              <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                  <v:fill type="tile" color="#f6f6f6"></v:fill>
              </v:background>
          <![endif]--> 
     <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"> 
       <tr> 
        <td valign="top" style="padding:0;Margin:0"> 
         <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
           <tr> 
            <td align="center" style="padding:0;Margin:0"> 
             <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
               <tr> 
                <td align="left" style="padding:30px;Margin:0"> 
                 <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   <tr> 
                    <td align="center" valign="top" style="padding:0;Margin:0;width:540px"> 
                     <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:40px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_fefcb1c3a0709260819ee122acfdf4b2/images/sislogo.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="64"></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
           </tr> 
         </table> 
         <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
           <tr> 
            <td align="center" style="padding:0;Margin:0"> 
             <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
               <tr> 
                <td align="left" style="padding:0;Margin:0;padding-bottom:30px;padding-left:30px;padding-right:30px"> 
                 <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   <tr> 
                    <td valign="top" align="center" style="padding:0;Margin:0;width:540px"> 
                     <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:41px;color:#0061ff;font-size:34px"><strong>Þú ert nú notandi í Veitu – vinnslukerfi umsókna um fjárhagsaðstoð hjá ${municipalityName}</strong></p></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
           </tr> 
         </table> 
         <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
           <tr> 
            <td align="center" style="padding:0;Margin:0"> 
             <table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
               <tr> 
                <td align="left" bgcolor="#f8f5fa" style="Margin:0;padding-left:30px;padding-right:30px;padding-top:40px;padding-bottom:40px;background-color:#f8f5fa"> 
                 <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   <tr> 
                    <td align="center" valign="top" style="padding:0;Margin:0;width:540px"> 
                     <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Í þessum pósti finnur þú leiðbeiningar um helstu atriði varðandi vinnslu umsókna í kerfinu. Þú getur smellt á takkann hér að neðan til að skrá þig inn í kerfið með rafrænum skilríkjum.</p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#2CB543;border-width:0px 0px 2px 0px;display:inline-block;border-radius:30px;width:auto;border-top-left-radius:8px;border-top-right-radius:8px;border-bottom-right-radius:8px;border-bottom-left-radius:8px;background-color:#0061ff;border-bottom-width:0px"><a href="${veitaUrl}" class="es-button es-button-1" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;border-style:solid;border-color:#0061ff;border-width:18px 24px;display:inline-block;background:#31CB4B;border-radius:30px;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-weight:bold;font-style:normal;line-height:22px;width:auto;text-align:center;background-color:#0061ff;border-top-left-radius:8px;border-top-right-radius:8px;border-bottom-right-radius:8px;border-bottom-left-radius:8px">Innskráning 
                           <!--[if !mso]><!-- --><img src="https://orohoy.stripocdn.email/content/guids/CABINET_fefcb1c3a0709260819ee122acfdf4b2/images/openiconwhite.png" alt="icon" align="absmiddle" height="24" style="display:inline-block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:middle;margin-left:8px"> 
                           <!--<![endif]--></a></span></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
               <tr> 
                <td align="left" style="Margin:0;padding-top:30px;padding-left:30px;padding-right:30px;padding-bottom:40px"> 
                 <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   <tr> 
                    <td align="center" valign="top" style="padding:0;Margin:0;width:540px"> 
                     <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px"><strong>Flokkar</strong></p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Flokkarnir <em>Innhólf</em>, <em>Mitt</em> og <em>Teymið</em> eru notaðar til að aðgreina mál. Undir Innhólf eru umsóknir sem enginn vinnsluaðili hefur tekið að sér. Mitt inniheldur mál sem þú ert með í vinnslu og undir <em>Teymi</em> finnur þú allar umsóknir um fjárhagsaðstoð í vinnslu hjá þér og þínu samstarfsfólki.</p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_fefcb1c3a0709260819ee122acfdf4b2/images/vinnsluadiliflokkar.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
                       </tr> 
                       <tr> 
                        <td align="center" style="padding:0;Margin:0;padding-top:40px;padding-bottom:40px;font-size:0"> 
                         <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                           <tr> 
                            <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td> 
                           </tr> 
                         </table></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px"><strong>Nýjar umsóknir</strong></p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Allar nýjar umsóknir sem koma inn í Veitu úr umsóknarflæðinu Ósk raðast í lista undir valmöguleikanum <em>Ný mál</em> í vinstri fleka kerfisins. Þar getur þú sem vinnsluaðili skoðað umsóknir og ákveðið hvort þú ætlir að taka að þér vinnslu málsins.</p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_fefcb1c3a0709260819ee122acfdf4b2/images/vinnsluadilinyjarumsoknir.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="44"></td> 
                       </tr> 
                       <tr> 
                        <td align="center" style="padding:0;Margin:0;padding-top:40px;padding-bottom:40px;font-size:0"> 
                         <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                           <tr> 
                            <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td> 
                           </tr> 
                         </table></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px"><strong>Hvernig tek ég að mér mál til að vinna úr því?</strong></p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Ef umsókn er ný og enginn vinnsluaðili hefur tekið að sér málið getur þú smellt á <em>Sjá um</em> á yfirlitsskjánum <em>Ný mál</em>.<br><br>Ef annar vinnsluaðili hefur tekið að sér mál og þú vilt taka yfir málið getur þú opnað umsóknina og smellt á <em>Sjá um</em> við hliðina á nafni vinnsluaðilans ofarlega í umsókninni.</p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_fefcb1c3a0709260819ee122acfdf4b2/images/minastillingar.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="44"></td> 
                       </tr> 
                       <tr> 
                        <td align="center" style="padding:0;Margin:0;padding-top:40px;padding-bottom:40px;font-size:0"> 
                         <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                           <tr> 
                            <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td> 
                           </tr> 
                         </table></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px"><strong>Stöður umsókna</strong></p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#00003c;font-size:18px">Á yfirlitssíðum mála getur þú séð stöðu umsóknarinnar í tögum. Stöðum umsókna má breyta í umsókninni sjálfri með því að smella á <em>Breyta stöðu</em>. Stundum breytist staða umsóknar án þess að vinnsluaðili breyti henni sjálf/ur, til dæmis þegar umsækjandi skilar inn gögnum sem vantaði; þá myndi staða umsóknar breytast úr <em>Vantar gögn</em> í <em>Ný gögn</em>.</p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_fefcb1c3a0709260819ee122acfdf4b2/images/nyumsokntag.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Umsókn er ný í kerfinu og enginn vinnsluaðili hefur tekið málið að sér.</p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_fefcb1c3a0709260819ee122acfdf4b2/images/urvinnslatag.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Vinnsluaðili hefur tekið málið að sér. </p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_fefcb1c3a0709260819ee122acfdf4b2/images/samthykkttag.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Umsókn hefur verið samþykkt.</p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_fefcb1c3a0709260819ee122acfdf4b2/images/synjadtag.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Umsókn hefur verið synjað.</p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_fefcb1c3a0709260819ee122acfdf4b2/images/vantargogn.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Í umsóknina vantar gögn. Þegar þessi staða er valin er umsækjanda send skilaboð og gert grein fyrir hvaða gögn vantar svo hægt sé að vinna umsóknina.</p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_fefcb1c3a0709260819ee122acfdf4b2/images/nygogntag.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Umsækjandi hefur svarað stöðunni <em>Vantar gögn</em> með því að hlaða upp gögnum í gegnum stöðusíðu umsóknarinnar. Þetta er í raun sama staða og staðan Úrvinnsla og textinn í taginu Ný gögn birtist eingöngu ef ekki hefur verið smellt á umsóknina eftir að ný gögn bárust.</p></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:10px;font-size:0px"><img class="adapt-img" src="https://orohoy.stripocdn.email/content/guids/CABINET_fefcb1c3a0709260819ee122acfdf4b2/images/utrunninumsokntag.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="32"></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:25px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Umsókn hefur runnið út á tíma. Þetta getur til dæmis gerst ef nauðsynleg gögn bárust ekki svo hægt væri að vinna úr umsókninni.</p></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
               <tr> 
                <td align="left" bgcolor="#f8f5fa" style="Margin:0;padding-left:30px;padding-right:30px;padding-top:40px;padding-bottom:40px;background-color:#f8f5fa"> 
                 <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                   <tr> 
                    <td align="center" valign="top" style="padding:0;Margin:0;width:540px"> 
                     <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'IBM Plex Sans', 'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#00003c;font-size:14px">Þú ert að fá þennan tölvupóst á netfangið ${to} vegna þess að þér var bætt við Veitu kerfið sem notandi.</p></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
           </tr> 
         </table></td> 
       </tr> 
     </table> 
    </div>  
   </body>
  </html>`
}
