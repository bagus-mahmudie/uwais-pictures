<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>XML Sitemap</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            background: #f3f3f3;
            color: #111;
            margin: 0;
            padding: 24px 18px;
          }

          h1 {
            font-size: 22px;
            margin: 0 0 14px;
          }

          p {
            margin: 0 0 18px;
            font-size: 14px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
          }

          th, td {
            border: 1px solid #d9d9d9;
            padding: 10px 8px;
            font-size: 14px;
            vertical-align: top;
          }

          th {
            background: #f1f1f1;
            font-weight: 700;
            text-align: left;
          }

          a {
            color: #2a72b5;
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }

          .wrap {
            width: 100%;
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>XML Sitemap</h1>
          <p>
            This sitemap contains
            <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong>
            URLs.
          </p>

          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a>
                      <xsl:attribute name="href">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:attribute>
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>