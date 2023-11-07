import * as fs from 'fs'
import multer from 'multer'
import { request as _request } from 'https'

const upload = multer({ dest: 'uploads/' })

app.get('/', (req, res) => res.render('index'))
app.get('/translations', (req, res) => res.render('translations'))

/*
 * REMOTE CONFIG
 * */

app.get('/download-template', (req, res, next) => {
  admin
    .remoteConfig()
    .getTemplate()
    .then((template) => {
      console.log('ETag from server: ' + template.etag)
      res.send(JSON.stringify(template))
    })
    .catch((err) => nex(err))
})

app.get('/list-versions', (req, res, next) => {
  admin
    .remoteConfig()
    .listVersions()
    .then((listVersionsResult) => {
      console.log('Successfully fetched the list of versions')

      const versions = []
      listVersionsResult.versions.forEach((version) => {
        versions.push(version)
      })

      res.send(versions)
    })
    .catch((err) => nex(err))
})

function validateTemplate (template) {
  return admin
    .remoteConfig()
    .validateTemplate(template)
    .then(function (validatedTemplate) {
      console.log('Template was valid and safe to use')
      return true
    })
    .catch(function (err) {
      console.error('Template is invalid and cannot be published')
      console.error(err)
      return false
    })
}

app.post(
  '/publish-template',
  upload.single('publish'),
  async (req, res, next) => {
    const config = admin.remoteConfig()
    let template

    try {
      if (!req.file) {
        throw new Error('No file uploaded')
      }

      const fileContent = fs.readFileSync(req.file.path, 'UTF8')
      template = config.createTemplateFromJSON(fileContent)

      const isValid = await validateTemplate(template)
      if (!isValid) {
        return nex(new Error('Template is invalid'))
      }
    } catch (err) {
      return next(new Error(err))
    }

    config
      .publishTemplate(template)
      .then((updatedTemplate) => {
        console.log('Template has been published')
        console.log('ETag from server: ' + updatedTemplate.etag)
        res.status(200).send('Template has been published')
      })
      .catch((err) => {
        console.error('Failed to publish template: ', err)
        next(err)
      })
  }
)
