export const javaReportsCourse = {
  id: 'java-reports',
  title: 'Java Report Development',
  description: 'Developing reports in Java using iText and Aspose libraries.',
  icon: 'FileText',
  category: 'Backend Languages',
  sections: [
    {
      id: 'javareport-intro',
      title: 'Introduction',
      image: '/images/courses/javareports_1776186111518.png',
      content: `In standard enterprise Java applications, developers frequently need to generate complex PDF, Word, or Excel reports dynamically. iText is primarily used for PDF generation, while Aspose provides robust suites to manipulate Word, Excel, and PDF formats without requiring Microsoft Office.`
    },
    {
      id: 'javareport-setup',
      title: 'Setup & Installation (Maven)',
      content: `### iText Dependency
\`\`\`xml
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>itextpdf</artifactId>
    <version>5.5.13.3</version>
</dependency>
\`\`\`

### Aspose.Cells Dependency
Register Aspose repository and add dependency:
\`\`\`xml
<repository>
    <id>AsposeJavaAPI</id>
    <name>Aspose Java API</name>
    <url>https://releases.aspose.com/java/repo/</url>
</repository>

<dependency>
    <groupId>com.aspose</groupId>
    <artifactId>aspose-cells</artifactId>
    <version>23.8</version>
</dependency>
\`\`\``
    },
    {
      id: 'javareport-itext',
      title: 'Example Code: iText PDF Generation',
      content: `\`\`\`java
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.FileOutputStream;

public class PdfGenerator {
    public static void main(String[] args) {
        Document document = new Document();
        try {
            PdfWriter.getInstance(document, new FileOutputStream("Report.pdf"));
            document.open();
            document.add(new Paragraph("Hello iText PDF Report!"));
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
\`\`\``
    },
    {
      id: 'javareport-aspose',
      title: 'Example Code: Aspose.Cells Excel Generation',
      content: `\`\`\`java
import com.aspose.cells.Workbook;
import com.aspose.cells.Worksheet;

public class ExcelGenerator {
    public static void main(String[] args) throws Exception {
        Workbook workbook = new Workbook();
        Worksheet worksheet = workbook.getWorksheets().get(0);
        
        // Add Data
        worksheet.getCells().get("A1").putValue("Sales Report");
        worksheet.getCells().get("A2").putValue("Q1 Revenue");
        worksheet.getCells().get("B2").putValue(50000);
        
        workbook.save("SalesReport.xlsx");
        System.out.println("Excel file created.");
    }
}
\`\`\``
    },
    {
      id: 'javareport-best-practices',
      title: 'Configuration & Best Practices',
      content: `### License Configuration for Aspose
To avoid watermark in Aspose outputs, apply commercial licenses via stream on application startup.
\`\`\`java
License license = new License();
license.setLicense(new FileInputStream("Aspose.Cells.lic"));
\`\`\`

### Thread Safety and Streams
- Always handle IO streams carefully, closing them inside a \`finally\` block or using try-with-resources.
- Report generation can be memory-intensive. When processing large data tables, utilize pagination and stream-based models.`
    }
  ]
};
