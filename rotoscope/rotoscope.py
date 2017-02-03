import sys
import cv2
import json
import numpy as np

from PIL import Image, ImageDraw, ImageFont

# Fonts
impact = ImageFont.truetype('fonts/impact.ttf', 46)
textFont = None

# Rotoscope function. Pass in the:
# - Destination image
# - Image to be warped
# - Rotoscpoe object with 'corners' and 'show' properties
def rotoscope(dst, warp, properties):
	if properties['show'] == False:
		return dst

	corners = properties['corners']

	wRows, wCols, wCh = warp.shape
	rows, cols, ch = dst.shape

	# Apply blur on warp
	kernel = np.ones((5, 5), np.float32) / 25
	warp = cv2.filter2D(warp, -1, kernel)

	# Prepare points to be matched on Affine Transformation
	pts1 = np.float32([[0, 0],[wCols, 0],[0, wRows]])
	pts2 = np.float32(corners) * 2

	# Enlarge image to multisample
	dst = cv2.resize(dst, (cols * 2, rows * 2))

	# Transform image with the Matrix
	M = cv2.getAffineTransform(pts1, pts2)
	cv2.warpAffine(warp, M, (cols * 2, rows * 2), dst, flags=cv2.INTER_AREA, borderMode=cv2.BORDER_TRANSPARENT)

	# Sample back image size
	dst = cv2.resize(dst, (cols, rows))

	return dst


def computeAndLoadTextFontForSize(drawer, text, maxWidth):
	global textFont

	# Measure text and find out position
	maxSize = 50
	minSize = 5
	curSize = maxSize
	while curSize >= minSize:
		textFont = ImageFont.truetype('fonts/impact.ttf', size=curSize)
		w, h = drawer.textsize(text, font=textFont)
		
		if w > maxWidth:
			curSize -= 1
		else:
			print('Best size: %d' % curSize)
			return
	print('Could not find best size: %d' % curSize)

def generateText(text):
	global impact, textFont

	# image = Image.open('text.png')
	txtColor = (20, 20, 20)
	bgColor = (224, 233, 237)
	# bgColor = (100, 0, 0)
	imgSize = (160, 200)
	
	# Create image
	image = Image.new("RGB", imgSize, bgColor)

	# Draw text on top
	draw = ImageDraw.Draw(image)

	# Load font for text
	if textFont == None:
		computeAndLoadTextFontForSize(draw, text, imgSize[0])
		
	w, h = draw.textsize(text, font=textFont)
	xCenter = (imgSize[0] - w) / 2
	yCenter = (50 - h) / 2
	draw.text((xCenter, 10 + yCenter), text, font=textFont, fill=txtColor)

	draw.text((12, 70), "IS NOW", font=impact, fill=txtColor)
	draw.text((10, 130), "ILLEGAL", font=impact, fill=txtColor)
	
	# Convert to CV2
	cvImage = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

	# cv2.imshow('text', cvImage)
	
	return cvImage

def cvImageToPillow(cvImage):
	cvImage = cv2.cvtColor(cvImage, cv2.COLOR_BGR2RGB)
	return Image.fromarray(cvImage)