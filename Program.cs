using System;
using System.IO;
using System.Text.RegularExpressions;

class Program {
    static void Main() {
        string logPath = @"C:\Users\jesus\.gemini\antigravity\brain\247c90e7-27db-4c84-bd66-239ee2163ddc\.system_generated\logs\transcript_full.jsonl";
        string targetFile = "StrategicHierarchyService.ts";
        using (StreamReader sr = new StreamReader(logPath)) {
            string line;
            while ((line = sr.ReadLine()) != null) {
                if (line.Contains("write_to_file") && line.Contains(targetFile)) {
                    // Quick and dirty regex for CodeContent
                    Match m = Regex.Match(line, @"""CodeContent"":""(.*?)""(?:,""|\})");
                    if (m.Success) {
                        string code = m.Groups[1].Value;
                        // Unescape JSON string
                        code = Regex.Unescape(code);
                        File.WriteAllText("scratch_service.ts", code);
                        Console.WriteLine("Found!");
                    }
                }
            }
        }
    }
}
