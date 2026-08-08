import json

with open(r'C:\Users\jesus\.gemini\antigravity\brain\247c90e7-27db-4c84-bd66-239ee2163ddc\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'PLANNER_RESPONSE':
            tool_calls = data.get('tool_calls', [])
            for call in tool_calls:
                if call.get('name') == 'default_api:write_to_file':
                    args = call.get('arguments', {})
                    if args.get('TargetFile', '').endswith('StrategicHierarchyService.ts'):
                        with open('scratch_service.ts', 'w', encoding='utf-8') as out:
                            out.write(args.get('CodeContent', ''))
                        print('Found write_to_file for StrategicHierarchyService.ts')
