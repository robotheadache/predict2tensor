import requests
import json
import csv
import os
url = "https://search.rcsb.org/rcsbsearch/v1/query"

searchquery ={
  "query": {
    "type": "group",
    "logical_operator": "and",
    "nodes": [
      {
        "type": "terminal",
        "service": "text",
        "parameters": {
          "operator": "equals",
          "negation": False,
          "value": 1,
          "attribute": "rcsb_assembly_info.polymer_entity_instance_count_protein"
        }
      },
      {
        "type": "terminal",
        "service": "text",
        "parameters": {
          "operator": "exact_match",
          "negation": False,
          "value": "Protein (only)",
          "attribute": "rcsb_entry_info.selected_polymer_entity_types"
        }
      }
    ]
      },
  "return_type": "entry",
    "request_options": {
      "return_all_hits": True 
  }
} 

response = requests.post(url, data=json.dumps(searchquery)).json()

result_items = response['result_set'] #extract results only

pdbids = []
for key in result_items:
    pdbids.append(key['identifier']) #for each result, pull its id

print(str(len(pdbids)) + " Results found!") 

with open('tmp/singleChains.csv', 'w') as file:
    writer = csv.writer(file)
    writer.writerow(pdbids)
#os.system("./batch_download.sh -f tmp/fullList.csv -o /pdbfiles -p")
