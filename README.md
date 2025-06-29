# Simple Mail Merge

<img width="972" alt="image" src="https://github.com/user-attachments/assets/3512b1fc-f19e-4b7c-9452-301dcde92aec" />


Mail merge DOCX files with Excel data in seconds - all in your browser!
Create personalized documents by combining Word templates with Excel data. Perfect for generating letters, certificates, invoices, and any document that needs to be customized for multiple recipients.

🌐 **Try it now:** [https://mailmerge.somtoms.app/](https://mailmerge.somtoms.app/)

## What It Does

Simple Mail Merge takes the tedious work out of creating personalized documents:

- 📄 **Upload a DOCX** with placeholders like `{firstName}` and `{email}`
- 📊 **Import your data** from an Excel spreadsheet
- 🎯 **Automatically match** your data columns to template placeholders
- ⚡ **Generate hundreds** of personalized documents in seconds
- 💾 **Download everything** as a combined DOCX

## How to Use

### Step 1: Prepare Your DOCX Template

Create a Word document with placeholders using curly braces:

```text
Dear {firstName} {lastName},

Thank you for your interest in our {productName}.
Your order number is {orderNumber}.

Best regards,
{senderName}
```

### Step 2: Prepare Your Excel Data

Create an Excel file with column headers matching your placeholders:

| firstName | lastName | productName | orderNumber | senderName |
|-----------|----------|-------------|-------------|------------|
| John      | Doe      | Widget Pro  | 12345       | Sales Team |
| Jane      | Smith    | Widget Plus | 12346       | Sales Team |

### Step 3: Upload and Merge

1. **Upload DOCX Template** - Select your Word document template
2. **Upload Excel Data** - Select your Excel file with data
3. **Map Fields** - The app will automatically match Excel columns to DOCX placeholders
4. **Generate Documents** - Click generate to create personalized documents
5. **Download** - Download the merged documents as a single DOCX file

## Development

Want to contribute or run this locally? Check out our [Contributing Guide](CONTRIBUTING.md) for setup instructions and development guidelines.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

## Support

Need help? Here's how to get assistance:

1. Check the [Common Issues](#common-issues) section below
2. Search existing [Issues](https://github.com/yourusername/simple-mailmerge/issues)
3. Create a new issue with details about your problem

## Common Issues

**Q: My placeholders aren't being recognized**
A: Make sure placeholders use curly braces like `{firstName}` with no spaces inside the braces.

**Q: Excel file won't upload**
A: Ensure your Excel file has column headers in the first row and data below. Supports .xlsx and .xls formats.

**Q: Auto-mapping isn't working**
A: Auto-mapping works best when Excel column names match placeholder names. You can always map fields manually.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
