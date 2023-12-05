# c10 Amity UI - Fork

## Getting started

### Installation
1. git clone https://github.com/curve10-projects/c10-amity-uikit.git
2. cd ./c10-amity-uikit
3. ensure you are in prod branch
4. ```npm ci``` or ```npm ci ---legacy-peer-deps``` if you get an error
5. update .env with api key and region, users can be mocked/fake names (i think?)
 
##### Develop locally in parallel with a product
1. install yalc globall if you don't have it ```npm i yalc -g```
2. build the ui kit: ```npm run build```
2. ```yalc publish``` in c10-amity-uikit directory 
3. ```yalc add c10amityui``` in adminsite repo
4. ```npm install``` in FE repo if this is the first time you've added it (use --legacy-peer-deps if error)
5. Please branch from prod, and work in your own branch. 
6. When you are done, ```yalc remove --all```  (from the adminsite folder)
(PLEASE ENSURE YOU DON'T COMMIT TO FE WITH THE YALC REFERENCE PRESENT)
YALC documentation: https://github.com/wclr/yalc

#### Develop with Storybook
1. ```npm run storybook```
2. http://localhost:6006/  to view sotrybook and update UI
3. Please branch from prod, and work in your own branch. 

#### Publish changes to NPM
1. Update the version number in package.json (check npm or prod branch to ensure correct version)
2. stage and commit all changes. 
3. merge changes into prod branch
4. open prod brach
5. ```npm run build```
6. ```npm publish``` (only curve10 team members currently have npm credentials)
Once published, rebuild product FE enviroment, and UI kit changes should be pulled in. 

### Documentation

Please refer to our online documentation at https://docs.amity.co or contact a Ui-Kit representative at **developers@amity.co** for support.

## Contributing
See [our contributing guide](https://github.com/EkoCommunications/AmityUiKitWeb/blob/develop/CONTRIBUTING.md)   
