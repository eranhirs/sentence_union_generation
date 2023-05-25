# Revisiting Sentence Union Generation as a Testbed for Text Consolidation


[Eran Hirsch](https://scholar.google.com/citations?user=GPsTrDEAAAAJ)<sup>1</sup>,
[Valentina Pyatkin](https://valentinapy.github.io/)<sup>1</sup>,
Ruben Wolhandler<sup>1</sup>,
[Avi Caciularu](https://aviclu.github.io/)<sup>1</sup>,
Asi Shefer<sup>2</sup>,
[Ido Dagan](https://u.cs.biu.ac.il/~dagani/)<sup>1</sup>
<br>
<sup>1</sup>Bar-Ilan University, <sup>2</sup>One AI

This is the official implementation of the paper [Revisiting Sentence Union Generation as a Testbed for Text Consolidation](https://arxiv.org/abs/2305.15605)  (Findings of ACL 2023).

## Abstract
Tasks involving text generation based on multiple input texts, such as multi-document summarization, long-form question answering and contemporary dialogue applications, challenge models for their ability to properly consolidate partly-overlapping multi-text information.
However, these tasks entangle the consolidation phase with the often subjective and ill-defined content selection requirement, impeding proper assessment of models' consolidation capabilities. 
In this paper, we suggest revisiting the sentence union generation task as an effective well-defined testbed for assessing text consolidation capabilities, decoupling the consolidation challenge from subjective content selection.
To support research on this task, we present refined annotation methodology and tools for crowdsourcing sentence union, create the largest union dataset to date and provide an analysis of its rich coverage of various consolidation aspects.
We then propose a comprehensive evaluation protocol for union generation, including both human and automatic evaluation. 
Finally, as baselines, we evaluate state-of-the-art language models on the task, along with a detailed analysis of their capacity to address multi-text consolidation challenges and their limitations.


## Dataset

The dataset is available in the `data` folder, as well as in [HuggingFace Datasets 🤗](https://huggingface.co/datasets/biu-nlp/sentence_union_generation).

## The Annotation Interface

Code for the annotation interface is available in the `annotation_interface` folder.

## The Evaluation Interface

Code for the evaluation interface is available in the `evaluation_interface` folder.

## Citation
If you find our work useful, please cite the paper as:


```bibtex
@article{hirsch2023revisiting,
         title={Revisiting Sentence Union Generation as a Testbed for Text Consolidation},
         author={Eran Hirsch and Valentina Pyatkin and Ruben Wolhandler and Avi Caciularu and Asi Shefer and Ido Dagan},
         journal={Findings of the 61st Annual Meeting of the Association for Computational Linguistics},
         year={2023}
}
```