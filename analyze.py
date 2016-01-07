import string
from fuzzywuzzy import fuzz
from fuzzywuzzy import process

header_title = 'Title'
header_experience = 'Experience'
header_skill = 'Skill'
title_multiplier = 0.15
skill_multiplier = 0.3
generic_multiplier = 0.1

def assign_key_multipler(job_description):
  key_multipler = {}
  header_keys = job_description.keys()

  for header in header_keys:
    if header == header_title:
      key_multipler.update({header: title_multiplier})
    elif header == header_skill:
      key_multipler.update({header: skill_multiplier})
    else:
      key_multipler.update({header: generic_multiplier})

  return key_multipler

def process_cv(extracted_resumes, key_multipler, job_description):
  result_list = []

  for resume in extracted_resumes:
    key_checked = []
    title_count, skill_count, generic_count = 0,0,0
    for multipler in key_multipler.keys():
      # Matching job title
      if resume.has_key(header_title) and multipler == header_title:

        # matching first level title
        if fuzz.partial_ratio(job_description[header_title], resume[header_title]) > 80:
          title_count += key_multipler[multipler]

         # recurse in experience
        if resume.has_key(header_experience):
          for experience in resume[header_experience]:
            if experience.has_key(header_title):
              if fuzz.partial_ratio(job_description[header_title], experience[header_title]) > 80:
                title_count += key_multipler[multipler]

      # Matching skills
      elif resume.has_key(header_skill) and multipler == header_skill:
        skill_count += recurse_obj(resume[multipler], job_description[multipler], multipler) * key_multipler[multipler]

      elif resume.has_key(multipler) and multipler not in key_checked:

        key_checked.append(multipler)
        if isinstance(resume[multipler], list) and isinstance(resume[multipler][0], basestring):
          generic_count += recurse_obj(resume[multipler], job_description[multipler], multipler) * key_multipler[multipler]
        elif isinstance(resume[multipler], basestring):
          if fuzz.token_sort_ratio(resume[multipler], job_description[multipler]) > 90:
            generic_count += key_multipler[multipler]
          elif fuzz.token_sort_ratio(resume[multipler], job_description[multipler]) > 60:
            generic_count += key_multipler[multipler] * 0.5

    score = title_count+skill_count+generic_count
    result_list.append({'Name': resume['Name'], 'Score': round(score, 2)})

  # Sort by score
  result_list = (sorted(result_list, key=lambda  t: t.get('Score', 0), reverse=True))
  return result_list

def recurse_obj(resume_obj, description_obj, header):
  count = 0
  choices = description_obj
  for item in resume_obj:
    extract_list = process.extract(item, choices, limit=2)
    for el in extract_list:
      if el[1] > 90:
        count += 1
      elif el[1] > 60:
        count += 0.5
  return count

def process_analyzer(job_description, extracted_resumes):
  key_multipler = assign_key_multipler(job_description)
  return process_cv(extracted_resumes, key_multipler, job_description)
