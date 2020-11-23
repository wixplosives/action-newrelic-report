
# Generate report from local metrics and latest metrics from NewRelic

# Install dependencies
Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...

# Publish 
Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  inpit_file: __tests__/fixtures/measure_result.json
  output_file: out.md
  nr_query_id: ${{ secrets.NEW_RELIC_QUERY_ID }}
  nr_account_id: ${{ secrets.NEW_RELIC_ACCOUNT_ID }}
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Make version 

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
