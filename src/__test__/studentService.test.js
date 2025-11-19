/* @jest-environment node */

import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Use ESM-compatible mocking for Jest
// We must mock the repository BEFORE importing the service under test.
jest.unstable_mockModule('../repository/studentRepository.js', () => ({
  createStudent: jest.fn(),
  findById: jest.fn(),
  deleteStudentById: jest.fn(),
  updateStudent: jest.fn(),
  updateStudentScores: jest.fn(),
  findStudentByName: jest.fn(),
  countStudentsByName: jest.fn(),
  findStudentsByMinScore: jest.fn(),
}));

// Dynamically import the mocked repo and the service
const repo = await import('../repository/studentRepository.js');
const service = await import('../service/studentService.js');

describe('studentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findStudent', () => {
    it('returns student without password when found', async () => {
      repo.findById.mockResolvedValue({ _id: '1', name: 'Alice', password: 'secret' });

      const result = await service.findStudent('1');

      expect(repo.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ _id: '1', name: 'Alice', password: undefined });
    });

    it('returns null when not found', async () => {
      repo.findById.mockResolvedValue(null);

      const result = await service.findStudent('404');

      expect(repo.findById).toHaveBeenCalledWith('404');
      expect(result).toBeNull();
    });
  });

  describe('addStudent', () => {
    it('creates student when not existing', async () => {
      repo.findById.mockResolvedValue(null); // findStudent -> not found
      repo.createStudent.mockResolvedValue({});

      const ok = await service.addStudent({ id: '10', name: 'Bob', password: 'pwd' });

      expect(ok).toBe(true);
      expect(repo.createStudent).toHaveBeenCalledWith({ _id: '10', name: 'Bob', password: 'pwd' });
    });

    it('does not create when already exists', async () => {
      repo.findById.mockResolvedValue({ _id: '10', name: 'Bob', password: 'pwd' });

      const ok = await service.addStudent({ id: '10', name: 'Bob', password: 'pwd' });

      expect(ok).toBe(false);
      expect(repo.createStudent).not.toHaveBeenCalled();
    });
  });

  describe('editStudent', () => {
    it('updates and strips password and scores when found', async () => {
      repo.updateStudent.mockResolvedValue({ _id: '2', name: 'Cory', password: 'x', scores: { math: 90 } });

      const updated = await service.editStudent('2', { name: 'Cory' });

      expect(repo.updateStudent).toHaveBeenCalledWith('2', { name: 'Cory' });
      expect(updated).toEqual({ _id: '2', name: 'Cory', password: undefined, scores: undefined });
    });

    it('returns null when student not found', async () => {
      repo.updateStudent.mockResolvedValue(null);

      const updated = await service.editStudent('2', { name: 'Cory' });

      expect(updated).toBeNull();
    });
  });

  describe('deleteStudent', () => {
    it('deletes and strips password when found', async () => {
      repo.deleteStudentById.mockResolvedValue({ _id: '3', name: 'Dana', password: 'x' });

      const deleted = await service.deleteStudent('3');

      expect(repo.deleteStudentById).toHaveBeenCalledWith('3');
      expect(deleted).toEqual({ _id: '3', name: 'Dana', password: undefined });
    });

    it('returns null when not found', async () => {
      repo.deleteStudentById.mockResolvedValue(null);

      const deleted = await service.deleteStudent('3');

      expect(deleted).toBeNull();
    });
  });

  describe('addSubjectAndScore', () => {
    it('updates scores when student exists and returns student (password removed)', async () => {
      // findStudent uses repo.findById inside service
      repo.findById.mockResolvedValue({ _id: '4', name: 'Eli', password: 'x' });
      repo.updateStudentScores.mockResolvedValue({});

      const student = await service.addSubjectAndScore('4', 'math', 95);

      expect(repo.findById).toHaveBeenCalledWith('4');
      expect(repo.updateStudentScores).toHaveBeenCalledWith('4', 'math', 95);
      expect(student).toEqual({ _id: '4', name: 'Eli', password: undefined });
    });

    it('does nothing when student does not exist', async () => {
      repo.findById.mockResolvedValue(null);

      const student = await service.addSubjectAndScore('404', 'math', 50);

      expect(repo.updateStudentScores).not.toHaveBeenCalled();
      expect(student).toBeNull();
    });
  });

  describe('pass-through queries', () => {
    it('findStudentsByName delegates to repository', async () => {
      const rows = [{ _id: 'a' }];
      repo.findStudentByName.mockResolvedValue(rows);

      const result = await service.findStudentsByName('Zoey');

      expect(repo.findStudentByName).toHaveBeenCalledWith('Zoey');
      expect(result).toBe(rows);
    });

    it('countByNames delegates to repository', async () => {
      repo.countStudentsByName.mockResolvedValue(3);

      const result = await service.countByNames(['Ann', 'Ben']);

      expect(repo.countStudentsByName).toHaveBeenCalledWith(['Ann', 'Ben']);
      expect(result).toBe(3);
    });

    it('findByMinScoreForExam delegates to repository', async () => {
      const rows = [{ _id: 'x' }];
      repo.findStudentsByMinScore.mockResolvedValue(rows);

      const result = await service.findByMinScoreForExam('math', 80);

      expect(repo.findStudentsByMinScore).toHaveBeenCalledWith('math', 80);
      expect(result).toBe(rows);
    });
  });
});
