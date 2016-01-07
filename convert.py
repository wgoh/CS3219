import os
from cStringIO import StringIO
from pdfminer.pdfparser import PDFParser
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter, PDFPageAggregator
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage, PDFTextExtractionNotAllowed
from pdfminer.pdfdevice import PDFDevice
import extract as ex
import pdfminer
import math

def convertWithCoordinatesPara(fname, pages=None):
  fontSize = {}
  pdfText = []

  print fname
  if not pages:
    pagenums = set()
  else:
    pagenums = set(pages)

  infile = file(fname, 'rb')

  parser = PDFParser(infile)
  document = PDFDocument(parser)

  laparams = LAParams()

  manager = PDFResourceManager()
  device = PDFPageAggregator(manager, laparams=laparams)

  interpreter = PDFPageInterpreter(manager, device)

  for page in PDFPage.create_pages(document):
    interpreter.process_page(page)
    layout = device.get_result()
    
    parse_obj_para(layout._objs, fontSize, pdfText)

  return {'fontSize': fontSize, 'pdfText': pdfText}

def parse_obj_para(lt_objs, fontSize, pdfText):

  # loop over the object list
  for obj in lt_objs:

    # if it's a textbox, print text and location
    if isinstance(obj, pdfminer.layout.LTTextBoxHorizontal):
      height = math.floor(obj.height)
      if fontSize.has_key(height):
        count = fontSize[height]
        fontSize[height] = count + 1
      else:
        fontSize[height] = 1
      text = obj.get_text().replace('\n', '_')

      lineTuple = (height, text)
      pdfText.append(text)

    # if it's a container, recurse
    elif isinstance(obj, pdfminer.layout.LTFigure):
      parse_obj(obj._objs)