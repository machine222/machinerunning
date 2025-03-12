/**
 * 네이버 검색광고 API 인증을 위한 서명 생성 헬퍼
 * 
 * 네이버 API는 HMAC-SHA256 방식으로 생성된 서명을 요구합니다.
 * 이 클래스는 타임스탬프, HTTP 메서드, URI, 비밀 키를 조합하여
 * API 인증에 필요한 서명을 생성합니다.
 */
import crypto from 'crypto';

export class Signature {
  /**
   * API 요청을 위한 서명을 생성합니다
   * 
   * @param timestamp - 현재 시간의 UNIX 타임스탬프(밀리초)
   * @param method - HTTP 메서드 (GET, POST, PUT, DELETE 등)
   * @param uri - 요청 경로 (/keywordstool 등)
   * @param secretKey - 비밀 키
   * @returns - Base64로 인코딩된 HMAC-SHA256 서명
   */
  static generate(timestamp: string, method: string, uri: string, secretKey: string): string {
    // "{timestamp}.{method}.{uri}" 형식의 메시지 생성
    const message = `${timestamp}.${method}.${uri}`;
    
    // HMAC-SHA256 해시 객체 생성
    const hmac = crypto.createHmac('sha256', secretKey);
    
    // 메시지로 해시 업데이트
    hmac.update(message);
    
    // Base64로 인코딩하여 서명 반환
    return hmac.digest('base64');
  }
}


/** 설명:

이 파일은 네이버 검색광고 API에서 요구하는 보안 서명을 생성하는 클래스를 정의합니다.
crypto 모듈을 사용하여 HMAC-SHA256 방식의 암호화를 구현합니다.
타임스탬프, HTTP 메서드, URI, 비밀 키를 조합한 메시지를 해싱한 후 Base64로 인코딩하여 서명을 생성합니다.
이 서명은 API 요청 헤더에 포함되어 인증에 사용됩니다. */