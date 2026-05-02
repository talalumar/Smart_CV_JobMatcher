import { create } from "zustand";

const useInterviewStore = create((set) => ({
  /*
  ========================================
  State
  ========================================
  */

  questions: null,

  currentSection: "technicalQuestions",

  currentQuestionIndex: 0,

  currentQuestion: "",

  userAnswer: "",

  evaluation: null,

  loading: false,

  /*
  ========================================
  Set Full Questions Response
  ========================================
  */

  setQuestions: (data) =>
    set(() => ({
      questions: data,
      currentSection:
        "technicalQuestions",
      currentQuestionIndex: 0,
      currentQuestion:
        data?.technicalQuestions?.[0] ||
        "",
      evaluation: null,
      userAnswer: "",
    })),

  /*
  ========================================
  Set User Answer
  ========================================
  */

  setUserAnswer: (answer) =>
    set(() => ({
      userAnswer: answer,
    })),

  /*
  ========================================
  Set Evaluation Result
  ========================================
  */

  setEvaluation: (data) =>
    set(() => ({
      evaluation: data,
    })),

  /*
  ========================================
  Loading State
  ========================================
  */

  setLoading: (value) =>
    set(() => ({
      loading: value,
    })),

  /*
  ========================================
  Next Question Logic
  ========================================
  */

  nextQuestion: () =>
    set((state) => {
      if (!state.questions)
        return {};

      const sections = [
        "technicalQuestions",
        "projectQuestions",
        "hrQuestions",
        "weakAreaQuestions",
        "roleSpecificQuestions",
      ];

      let currentSectionIndex =
        sections.indexOf(
          state.currentSection
        );

      let nextIndex =
        state.currentQuestionIndex +
        1;

      let nextSection =
        state.currentSection;

      let nextQuestion =
        state.questions[
          state.currentSection
        ]?.[nextIndex];

      /*
      If no more questions in current section,
      move to next section
      */

      while (
        !nextQuestion &&
        currentSectionIndex <
          sections.length - 1
      ) {
        currentSectionIndex += 1;

        nextSection =
          sections[
            currentSectionIndex
          ];

        nextIndex = 0;

        nextQuestion =
          state.questions[
            nextSection
          ]?.[0];
      }

      /*
      If interview completed
      */

      if (!nextQuestion) {
        return {
          currentQuestion:
            "Interview Completed 🎉",
          evaluation: null,
          userAnswer: "",
        };
      }

      return {
        currentSection:
          nextSection,

        currentQuestionIndex:
          nextIndex,

        currentQuestion:
          nextQuestion,

        evaluation: null,

        userAnswer: "",
      };
    }),

  /*
  ========================================
  Reset Interview
  ========================================
  */

  resetInterview: () =>
    set(() => ({
      questions: null,
      currentSection:
        "technicalQuestions",
      currentQuestionIndex: 0,
      currentQuestion: "",
      userAnswer: "",
      evaluation: null,
      loading: false,
    })),
}));

export default useInterviewStore;