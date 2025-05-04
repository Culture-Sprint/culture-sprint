
import { FormCacheManager } from '../managers/formCacheManager';

describe('FormCacheManager', () => {
  let formCache: FormCacheManager;
  
  beforeEach(() => {
    formCache = new FormCacheManager();
    sessionStorage.clear();
  });
  
  test('should set and get form data', () => {
    const projectId = 'test-project';
    const formType = 'default';
    const formData = { fields: ['field1', 'field2'] };
    
    formCache.setForm(projectId, formType, formData);
    const retrieved = formCache.getForm<typeof formData>(projectId, formType, null);
    
    expect(retrieved).toEqual(formData);
  });
  
  test('should handle different form types', () => {
    const projectId = 'test-project';
    const data1 = { type: 'form1' };
    const data2 = { type: 'form2' };
    
    formCache.setForm(projectId, 'type1', data1);
    formCache.setForm(projectId, 'type2', data2);
    
    expect(formCache.getForm(projectId, 'type1', null)).toEqual(data1);
    expect(formCache.getForm(projectId, 'type2', null)).toEqual(data2);
  });
  
  test('should remove form data', () => {
    const projectId = 'test-project';
    const formType = 'default';
    const formData = { test: true };
    
    formCache.setForm(projectId, formType, formData);
    formCache.removeForm(projectId, formType);
    
    expect(formCache.getForm(projectId, formType, null)).toBeNull();
  });
  
  test('should clear all forms for a project', () => {
    const projectId = 'test-project';
    
    formCache.setForm(projectId, 'type1', { data: 1 });
    formCache.setForm(projectId, 'type2', { data: 2 });
    formCache.setForm('other-project', 'type1', { data: 3 });
    
    formCache.clearAll(projectId);
    
    expect(formCache.getForm(projectId, 'type1', null)).toBeNull();
    expect(formCache.getForm(projectId, 'type2', null)).toBeNull();
    expect(formCache.getForm('other-project', 'type1', null)).not.toBeNull();
  });
});
